const db = require('../dataBase/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// Função auxiliar para validações
function validarUsuario(dados) {
    const erros = [];

    // Campos obrigatórios
    const camposObrigatorios = ['usu_nome', 'usu_documento', 'usu_email', 'usu_senha', 'inst_id', 'usu_telefone', 'usu_tipo', 'usu_status'];
    camposObrigatorios.forEach(campo => {
        if (dados[campo] === undefined || dados[campo] === null || dados[campo] === '') {
            erros.push(`${campo} é obrigatório`);
        }
    });

    // Validações de formato
    if (dados.usu_documento && !/^\d{11}$/.test(dados.usu_documento)) {
        erros.push('Documento deve ter 11 dígitos numéricos');
    }
    if (dados.usu_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.usu_email)) {
        erros.push('Email inválido');
    }
    if (dados.usu_status !== undefined && ![0, 1].includes(dados.usu_status)) {
        erros.push('Status deve ser 0 ou 1');
    }

    return erros;
}

module.exports = {
    async listarUsuario(request, response) {
        try {

            const sql = `
        SELECT
            usu_id,
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
            CAST(usu_status AS UNSIGNED) AS usu_status
        FROM Usuario
        `;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de usuário obtida com sucesso',
                    itens: rows.length,
                    dados: rows

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar usuário: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async usuariosLogin(request, response) {
        try {
            const { email, senha } = request.body;

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
            const { nome, documento, senha, email, telefone, tipo, inst_id, foto, biometria, status = 1 } = request.body;
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            const dados = {
                usu_nome: nome,
                usu_documento: documento,
                usu_email: email,
                usu_senha: senhaCriptografada,
                inst_id,
                usu_telefone: telefone,
                usu_tipo: tipo,
                usu_status: status
            };

            console.log('BODY RECEBIDO:', request.body);
            console.log('DADOS PARA VALIDAR:', dados);

            const erros = validarUsuario(dados);

            console.log('ERROS DE VALIDACAO:', erros);

            if (erros.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Erros de validação',
                    erros: erros
                });
            }

            const [instExistente] = await db.query(
                'SELECT inst_id FROM Instituicao WHERE inst_id = ?',
                [inst_id]
            );

            if (instExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Instituição não encontrada'
                });
            }

            const [emailExistente] = await db.query(
                'SELECT usu_id FROM Usuario WHERE usu_email = ?',
                [email]
            );

            if (emailExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email já cadastrado'
                });
            }

            const [docExistente] = await db.query(
                'SELECT usu_id FROM Usuario WHERE usu_documento = ?',
                [documento]
            );

            if (docExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Documento já cadastrado'
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

            const values = [
                nome,
                documento,
                email,
                senhaCriptografada,
                new Date(),
                inst_id,
                telefone,
                foto || null,
                biometria || null,
                tipo,
                status
            ];

            const [result] = await db.query(sql, values);

            const dadosRetorno = {
                id: result.insertId,
                nome,
                documento,
                email,
                telefone,
                tipo,
                inst_id,
                status
            };

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de usuário realizado com sucesso',
                dados: dadosRetorno
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

            const { nome, documento, senha, email, telefone, tipo, status, inst_id } = request.body;

            const { id } = request.params;

            const dados = { usu_nome: nome, usu_documento: documento, usu_email: email, usu_senha: senha, inst_id, usu_telefone: telefone, usu_tipo: tipo, usu_status: status };

            // Verificar se usuário existe
            const [usuarioExistente] = await db.query('SELECT usu_id, usu_email, usu_documento FROM Usuario WHERE usu_id = ?', [id]);
            if (usuarioExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado'
                });
            }

            // Validações
            const erros = validarUsuario(dados);
            if (erros.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Erros de validação',
                    erros: erros
                });
            }

            // Verificar se inst_id existe
            const [instExistente] = await db.query('SELECT inst_id FROM Instituicao WHERE inst_id = ?', [inst_id]);
            if (instExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Instituição não encontrada'
                });
            }

            // Verificar unicidade do email se mudou
            if (email !== usuarioExistente[0].usu_email) {
                const [emailExistente] = await db.query('SELECT usu_id FROM Usuario WHERE usu_email = ? AND usu_id != ?', [email, id]);
                if (emailExistente.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Email já cadastrado para outro usuário'
                    });
                }
            }

            // Verificar unicidade do documento se mudou
            if (documento !== usuarioExistente[0].usu_documento) {
                const [docExistente] = await db.query('SELECT usu_id FROM Usuario WHERE usu_documento = ? AND usu_id != ?', [documento, id]);
                if (docExistente.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Documento já cadastrado para outro usuário'
                    });
                }
            }

            const sql = ` UPDATE Usuario SET 
             usu_nome = ?, usu_documento = ?, usu_email = ?, usu_senha = ?, inst_id = ?, usu_telefone = ? , usu_tipo = ?, usu_status = ?
             WHERE 
             usu_id = ?
             `;

            const values = [nome, documento, email, senha, inst_id, telefone, tipo, status, id];

            const [result] = await db.query(sql, values);


            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} não encontrado!`,
                    dados: null
                });
            }

            const dadosRetorno = {
                id,
                nome,
                documento,
                email,
                senha,
                telefone,
                tipo,
                inst_id,
                status
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Usuário ${id} atualizado com sucesso!`,
                    dados: dadosRetorno

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar usuário: ${error.message} `,
                    dados: error.message
                }
            );
        }

    },
    async ocultarUsuario(request, response) {
        try {
            const { id } = request.params;
            const { tipoSolicitante } = request.body;

            if (tipoSolicitante !== 'Administrador') {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Apenas administradores podem ocultar usuários.',
                    dados: null
                });
            }

            const [usuarioExistente] = await db.query(
                'SELECT usu_id, usu_status FROM Usuario WHERE usu_id = ?',
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
            const { tipoSolicitante } = request.body;

            if (tipoSolicitante !== 'Administrador') {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Apenas administradores podem ativar usuários.',
                    dados: null
                });
            }

            const [usuarioExistente] = await db.query(
                'SELECT usu_id, usu_status FROM Usuario WHERE usu_id = ?',
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

            // Verificar se usuário existe
            const [usuarioExistente] = await db.query('SELECT usu_id FROM Usuario WHERE usu_id = ?', [id]);
            if (usuarioExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado'
                });
            }

            // Verificar se há logs relacionados (opcional, dependendo das regras de negócio)
            const [logs] = await db.query('SELECT log_id FROM Logs_Acao WHERE usu_id = ?', [id]);
            if (logs.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir usuário com logs de ação registrados'
                });
            }

            const sql = `DELETE FROM Usuario where usu_id = ?`;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Usuário ${id} excluído com sucesso`,
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar usuário: ${error.message} `,
                    dados: error.message
                }
            );

        }

    }
}

