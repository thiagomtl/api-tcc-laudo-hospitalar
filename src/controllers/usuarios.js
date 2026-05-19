const db = require('../dataBase/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function validarUsuario(dados) {
    const erros = [];

    const camposObrigatorios = [
        'usu_nome',
        'usu_documento',
        'usu_email',
        'usu_senha',
        'inst_id',
        'usu_telefone',
        'usu_tipo',
        'usu_status'
    ];

    camposObrigatorios.forEach(campo => {
        if (dados[campo] === undefined || dados[campo] === null || dados[campo] === '') {
            erros.push(`${campo} é obrigatório`);
        }
    });

    if (dados.usu_documento && !/^\d{11}$/.test(dados.usu_documento)) {
        erros.push('Documento deve ter 11 dígitos numéricos');
    }

    if (dados.usu_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.usu_email)) {
        erros.push('Email inválido');
    }

    if (dados.usu_status !== undefined && ![0, 1].includes(Number(dados.usu_status))) {
        erros.push('Status deve ser 0 ou 1');
    }

    return erros;
}

module.exports = {
    async perfilUsuario(request, response) {
        try {
            const usuarioId = request.usuario.id;

            const [colunasCrm] = await db.query(
                "SHOW COLUMNS FROM Usuario LIKE 'usu_crm'"
            );
            const campoCrm = colunasCrm.length > 0 ? ', u.usu_crm' : '';

            const sql = `
                SELECT
                    u.usu_id,
                    u.usu_nome,
                    u.usu_documento,
                    u.usu_email,
                    u.usu_datacriacao,
                    u.inst_id,
                    u.usu_telefone,
                    u.usu_foto,
                    u.usu_biometria,
                    u.usu_tipo,
                    CAST(u.usu_status AS UNSIGNED) AS usu_status,
                    i.inst_nome${campoCrm}
                FROM Usuario u
                LEFT JOIN Instituicao i ON i.inst_id = u.inst_id
                WHERE u.usu_id = ?
            `;

            const [rows] = await db.query(sql, [usuarioId]);

            if (rows.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuario nao encontrado',
                    dados: null
                });
            }

            const usuario = rows[0];

            if (usuario.usu_crm === undefined) {
                usuario.usu_crm = null;
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Perfil obtido com sucesso',
                dados: usuario
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao obter perfil: ${error.message}`,
                dados: null
            });
        }
    },

    async listarUsuario(request, response) {
        try {
            const sql = `
                SELECT
                    usu_id,
                    usu_nome,
                    usu_documento,
                    usu_email,
                    usu_datacriacao,
                    inst_id,
                    usu_telefone,
                    usu_foto,
                    usu_biometria,
                    usu_tipo,
                    CAST(usu_status AS UNSIGNED) AS usu_status
                FROM Usuario
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuário obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar usuário: ${error.message}`,
                dados: null
            });
        }
    },

    async usuariosLogin(request, response) {
        try {
            const { email, senha } = request.body;

            if (!email || !senha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email e senha são obrigatórios.',
                    dados: null
                });
            }

            const sql = `
                SELECT
                    usu_id,
                    usu_nome,
                    usu_email,
                    usu_senha,
                    usu_tipo,
                    inst_id,
                    CAST(usu_status AS UNSIGNED) AS usu_status
                FROM Usuario
                WHERE usu_email = ? AND usu_status = 1
            `;

            const [rows] = await db.query(sql, [email]);

            if (rows.length < 1) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Login e/ou senha incorretos',
                    dados: null
                });
            }

            const usuario = rows[0];

            const senhaValida = await bcrypt.compare(senha, usuario.usu_senha);

            if (!senhaValida) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Login e/ou senha incorretos',
                    dados: null
                });
            }

            delete usuario.usu_senha;

            const token = jwt.sign(
                {
                    usu_id: usuario.usu_id,
                    id: usuario.usu_id,
                    nome: usuario.usu_nome,
                    email: usuario.usu_email,
                    tipo: usuario.usu_tipo,
                    inst_id: usuario.inst_id
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                dados: {
                    usuario,
                    token
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao realizar login.',
                dados: error.message
            });
        }
    },

    async cadastrarUsuario(request, response) {
        try {
            const {
                nome,
                documento,
                senha,
                email,
                telefone,
                tipo,
                inst_id,
                foto,
                biometria,
                status = 1
            } = request.body;

            const erros = validarUsuario(dadosValidacao);

            if (erros.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Erros de validação',
                    erros
                });
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const dadosValidacao = {
                usu_nome: nome,
                usu_documento: documento,
                usu_email: email,
                usu_senha: senha,
                inst_id,
                usu_telefone: telefone,
                usu_tipo: tipo,
                usu_status: Number(status)
            };

            const [instExistente] = await db.query(
                'SELECT inst_id FROM Instituicao WHERE inst_id = ?',
                [inst_id]
            );

            if (instExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Instituição não encontrada',
                    dados: null
                });
            }

            const [emailExistente] = await db.query(
                'SELECT usu_id FROM Usuario WHERE usu_email = ?',
                [email]
            );

            if (emailExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email já cadastrado',
                    dados: null
                });
            }

            const [docExistente] = await db.query(
                'SELECT usu_id FROM Usuario WHERE usu_documento = ?',
                [documento]
            );

            if (docExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Documento já cadastrado',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Usuario (
                    usu_nome,
                    usu_documento,
                    usu_email,
                    usu_senha,
                    usu_datacriacao,
                    inst_id,
                    usu_telefone,
                    usu_foto,
                    usu_biometria,
                    usu_tipo,
                    usu_status
                ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                nome,
                documento,
                email,
                senhaCriptografada,
                inst_id,
                telefone,
                foto || null,
                biometria || null,
                tipo,
                Number(status)
            ];

            const [result] = await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de usuário realizado com sucesso',
                dados: {
                    id: result.insertId,
                    nome,
                    documento,
                    email,
                    telefone,
                    tipo,
                    inst_id,
                    status: Number(status)
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar usuário: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarUsuario(request, response) {
        try {
            const {
                nome,
                documento,
                senha,
                email,
                telefone,
                tipo,
                status,
                inst_id
            } = request.body;

            const { id } = request.params;

            const [usuarioExistente] = await db.query(
                'SELECT usu_id, usu_email, usu_documento FROM Usuario WHERE usu_id = ?',
                [id]
            );

            if (usuarioExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado',
                    dados: null
                });
            }

            const dadosValidacao = {
                usu_nome: nome,
                usu_documento: documento,
                usu_email: email,
                usu_senha: senha,
                inst_id,
                usu_telefone: telefone,
                usu_tipo: tipo,
                usu_status: Number(status)
            };

            const erros = validarUsuario(dadosValidacao);

            if (erros.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Erros de validação',
                    erros
                });
            }

            const [instExistente] = await db.query(
                'SELECT inst_id FROM Instituicao WHERE inst_id = ?',
                [inst_id]
            );

            if (instExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Instituição não encontrada',
                    dados: null
                });
            }

            if (email !== usuarioExistente[0].usu_email) {
                const [emailExistente] = await db.query(
                    'SELECT usu_id FROM Usuario WHERE usu_email = ? AND usu_id != ?',
                    [email, id]
                );

                if (emailExistente.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Email já cadastrado para outro usuário',
                        dados: null
                    });
                }
            }

            if (documento !== usuarioExistente[0].usu_documento) {
                const [docExistente] = await db.query(
                    'SELECT usu_id FROM Usuario WHERE usu_documento = ? AND usu_id != ?',
                    [documento, id]
                );

                if (docExistente.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Documento já cadastrado para outro usuário',
                        dados: null
                    });
                }
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const sql = `
                UPDATE Usuario
                SET
                    usu_nome = ?,
                    usu_documento = ?,
                    usu_email = ?,
                    usu_senha = ?,
                    inst_id = ?,
                    usu_telefone = ?,
                    usu_tipo = ?,
                    usu_status = ?
                WHERE usu_id = ?
            `;

            const values = [
                nome,
                documento,
                email,
                senhaCriptografada,
                inst_id,
                telefone,
                tipo,
                Number(status),
                id
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} atualizado com sucesso!`,
                dados: {
                    id: Number(id),
                    nome,
                    documento,
                    email,
                    telefone,
                    tipo,
                    inst_id,
                    status: Number(status)
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar usuário: ${error.message}`,
                dados: error.message
            });
        }
    },

    async ocultarUsuario(request, response) {
        try {
            const { id } = request.params;

            const [usuarioExistente] = await db.query(
                'SELECT usu_id, CAST(usu_status AS UNSIGNED) AS usu_status FROM Usuario WHERE usu_id = ?',
                [id]
            );

            if (usuarioExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado',
                    dados: null
                });
            }

            if (usuarioExistente[0].usu_status === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuário já está oculto/inativo',
                    dados: null
                });
            }

            await db.query(
                'UPDATE Usuario SET usu_status = 0 WHERE usu_id = ?',
                [id]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} ocultado com sucesso`,
                dados: {
                    id: Number(id),
                    status: 0
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao ocultar usuário: ${error.message}`,
                dados: error.message
            });
        }
    },

    async ativarUsuario(request, response) {
        try {
            const { id } = request.params;

            const [usuarioExistente] = await db.query(
                'SELECT usu_id, CAST(usu_status AS UNSIGNED) AS usu_status FROM Usuario WHERE usu_id = ?',
                [id]
            );

            if (usuarioExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado',
                    dados: null
                });
            }

            if (usuarioExistente[0].usu_status === 1) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuário já está ativo',
                    dados: null
                });
            }

            await db.query(
                'UPDATE Usuario SET usu_status = 1 WHERE usu_id = ?',
                [id]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} ativado com sucesso`,
                dados: {
                    id: Number(id),
                    status: 1
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao ativar usuário: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarUsuario(request, response) {
        try {
            const { id } = request.params;

            const [usuarioExistente] = await db.query(
                'SELECT usu_id FROM Usuario WHERE usu_id = ?',
                [id]
            );

            if (usuarioExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado',
                    dados: null
                });
            }

            const erros = validarUsuario(dadosValidacao);

            if (erros.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Erros de validação',
                    erros
                });
            }

            if (logs.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir usuário com logs de ação registrados',
                    dados: null
                });
            }

            await db.query(
                'DELETE FROM Usuario WHERE usu_id = ?',
                [id]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} excluído com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar usuário: ${error.message}`,
                dados: error.message
            });
        }
    }
};
