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

function usuarioEhMedico(tipo) {
    return String(tipo || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase() === 'medico';
}

function usuarioPodeAlterarCrm(tipo) {
    const tipoNormalizado = String(tipo || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return tipoNormalizado === 'medico';
}

async function buscarPerfilPorId(usuarioId) {
    const [rows] = await db.query(
        `
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
            i.inst_nome,
            m.med_id,
            m.med_crm,
            m.med_crm AS usu_crm
        FROM Usuario u
        LEFT JOIN Instituicao i ON i.inst_id = u.inst_id
        LEFT JOIN Medico m ON m.usu_id = u.usu_id
        WHERE u.usu_id = ?
        `,
        [usuarioId]
    );

    return rows[0] || null;
}

module.exports = {
    async perfilUsuario(request, response) {
        try {
            const usuarioId = request.usuario?.usu_id || request.usuario?.id;

            if (!usuarioId) {
                return response.status(401).json({
                    sucesso: false,
                    mensagem: "Usuário não autenticado.",
                    dados: null
                });
            }

            const [rows] = await db.query(
                `
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
                i.inst_nome,
                m.med_id,
                m.med_crm,
                m.med_crm AS usu_crm
            FROM Usuario u
            LEFT JOIN Instituicao i ON i.inst_id = u.inst_id
            LEFT JOIN Medico m ON m.usu_id = u.usu_id
            WHERE u.usu_id = ?
            `,
                [usuarioId]
            );

            if (rows.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Usuário não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Perfil obtido com sucesso.",
                dados: rows[0]
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao buscar perfil: ${error.message}`,
                dados: null
            });
        }
    },

    async editarPerfil(request, response) {
        try {
            const usuarioId = request.usuario?.usu_id || request.usuario?.id;

            if (!usuarioId) {
                return response.status(401).json({
                    sucesso: false,
                    mensagem: 'Usuario nao autenticado.',
                    dados: null
                });
            }

            const perfilAtual = await buscarPerfilPorId(usuarioId);

            if (!perfilAtual) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuario nao encontrado.',
                    dados: null
                });
            }

            const { telefone, crm } = request.body;
            const telefoneLimpo = String(telefone || '').replace(/\D/g, '');
            const crmFoiEnviado = crm !== undefined && crm !== null;
            const crmLimpo = String(crm || '').trim().toUpperCase();
            const podeAlterarCrm = usuarioPodeAlterarCrm(perfilAtual.usu_tipo);

            if (!/^\d{10,11}$/.test(telefoneLimpo)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Telefone deve ter 10 ou 11 digitos.',
                    dados: null
                });
            }

            if (crmFoiEnviado && !podeAlterarCrm) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Este usuario nao pode alterar CRM.',
                    dados: null
                });
            }

            if (usuarioEhMedico(perfilAtual.usu_tipo) && !crmLimpo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM e obrigatorio para usuario medico.',
                    dados: null
                });
            }

            if (crmFoiEnviado && crmLimpo.length > 8) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM deve ter ate 8 caracteres.',
                    dados: null
                });
            }

            if (podeAlterarCrm && crmLimpo) {
                const [crmDuplicado] = await db.query(
                    'SELECT med_id FROM Medico WHERE med_crm = ? AND usu_id != ?',
                    [crmLimpo, usuarioId]
                );

                if (crmDuplicado.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'CRM ja cadastrado para outro usuario.',
                        dados: null
                    });
                }
            }

            await db.query(
                `
                UPDATE Usuario
                SET
                    usu_telefone = ?
                WHERE usu_id = ?
                `,
                [telefoneLimpo, usuarioId]
            );

            if (podeAlterarCrm && crmLimpo) {
                if (perfilAtual.med_id) {
                    await db.query(
                        'UPDATE Medico SET med_crm = ? WHERE usu_id = ?',
                        [crmLimpo, usuarioId]
                    );
                } else {
                    await db.query(
                        'INSERT INTO Medico (usu_id, med_crm) VALUES (?, ?)',
                        [usuarioId, crmLimpo]
                    );
                }
            }

            const perfilAtualizado = await buscarPerfilPorId(usuarioId);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Perfil atualizado com sucesso.',
                dados: perfilAtualizado
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar perfil: ${error.message}`,
                dados: error.message
            });
        }
    },

    async alterarEmail(request, response) {
        try {
            const usuarioId = request.usuario?.usu_id || request.usuario?.id;

            if (!usuarioId) {
                return response.status(401).json({
                    sucesso: false,
                    mensagem: 'Usuario nao autenticado.',
                    dados: null
                });
            }

            const {
                emailAtual,
                novoEmail,
                confirmarNovoEmail
            } = request.body;

            const emailAtualLimpo = String(emailAtual || '').trim().toLowerCase();
            const novoEmailLimpo = String(novoEmail || '').trim().toLowerCase();
            const confirmarNovoEmailLimpo = String(confirmarNovoEmail || '').trim().toLowerCase();
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailAtualLimpo || !novoEmailLimpo || !confirmarNovoEmailLimpo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Todos os campos sao obrigatorios.',
                    dados: null
                });
            }

            if (!emailValido.test(emailAtualLimpo) || !emailValido.test(novoEmailLimpo)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe um e-mail valido.',
                    dados: null
                });
            }

            if (novoEmailLimpo !== confirmarNovoEmailLimpo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O novo e-mail e a confirmacao precisam ser iguais.',
                    dados: null
                });
            }

            const [usuarios] = await db.query(
                'SELECT usu_id, usu_email FROM Usuario WHERE usu_id = ?',
                [usuarioId]
            );

            if (usuarios.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuario nao encontrado.',
                    dados: null
                });
            }

            const usuario = usuarios[0];

            if (String(usuario.usu_email || '').trim().toLowerCase() !== emailAtualLimpo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'E-mail atual incorreto.',
                    dados: null
                });
            }

            if (emailAtualLimpo === novoEmailLimpo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O novo e-mail deve ser diferente do e-mail atual.',
                    dados: null
                });
            }

            const [emailExistente] = await db.query(
                'SELECT usu_id FROM Usuario WHERE LOWER(usu_email) = ? AND usu_id != ?',
                [novoEmailLimpo, usuarioId]
            );

            if (emailExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Este e-mail ja esta cadastrado para outro usuario.',
                    dados: null
                });
            }

            await db.query(
                'UPDATE Usuario SET usu_email = ? WHERE usu_id = ?',
                [novoEmailLimpo, usuarioId]
            );

            const perfilAtualizado = await buscarPerfilPorId(usuarioId);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'E-mail atualizado com sucesso.',
                dados: perfilAtualizado
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar e-mail: ${error.message}`,
                dados: error.message
            });
        }
    },

    async alterarSenha(request, response) {
        try {
            const usuarioId = request.usuario?.usu_id || request.usuario?.id;

            if (!usuarioId) {
                return response.status(401).json({
                    sucesso: false,
                    mensagem: 'Usuario nao autenticado.',
                    dados: null
                });
            }

            const {
                senhaAtual,
                novaSenha,
                confirmarNovaSenha
            } = request.body;

            if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Todos os campos sao obrigatorios.',
                    dados: null
                });
            }

            if (novaSenha !== confirmarNovaSenha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'A nova senha e a confirmacao precisam ser iguais.',
                    dados: null
                });
            }

            if (String(novaSenha).length < 6) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'A nova senha deve ter pelo menos 6 caracteres.',
                    dados: null
                });
            }

            if (senhaAtual === novaSenha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'A nova senha deve ser diferente da senha atual.',
                    dados: null
                });
            }

            const [usuarios] = await db.query(
                'SELECT usu_id, usu_senha FROM Usuario WHERE usu_id = ?',
                [usuarioId]
            );

            if (usuarios.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuario nao encontrado.',
                    dados: null
                });
            }

            const usuario = usuarios[0];
            const senhaAtualValida = await bcrypt.compare(senhaAtual, usuario.usu_senha);

            if (!senhaAtualValida) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Senha atual incorreta.',
                    dados: null
                });
            }

            const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

            await db.query(
                'UPDATE Usuario SET usu_senha = ? WHERE usu_id = ?',
                [senhaCriptografada, usuarioId]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Senha atualizada com sucesso.',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar senha: ${error.message}`,
                dados: error.message
            });
        }
    },
    
    async listarUsuario(request, response) {
        try {
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
                    m.med_id,
                    m.med_crm
                FROM Usuario u
                LEFT JOIN Medico m ON m.usu_id = u.usu_id
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
                    u.usu_id,
                    u.usu_nome,
                    u.usu_email,
                    u.usu_senha,
                    u.usu_tipo,
                    u.inst_id,
                    CAST(u.usu_status AS UNSIGNED) AS usu_status,
                    m.med_id,
                    m.med_crm
                FROM Usuario u
                LEFT JOIN Medico m ON m.usu_id = u.usu_id
                WHERE u.usu_email = ? AND u.usu_status = 1
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
                    inst_id: usuario.inst_id,
                    med_id: usuario.med_id || null
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
                status = 1,
                crm
            } = request.body;

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

            if (usuarioEhMedico(tipo) && !crm) {
                erros.push('CRM e obrigatorio para usuario medico');
            }

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

            if (usuarioEhMedico(tipo)) {
                const [crmExistente] = await db.query(
                    'SELECT med_id FROM Medico WHERE med_crm = ?',
                    [crm]
                );

                if (crmExistente.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'CRM ja cadastrado',
                        dados: null
                    });
                }
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

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

            if (usuarioEhMedico(tipo)) {
                await db.query(
                    'INSERT INTO Medico (usu_id, med_crm) VALUES (?, ?)',
                    [result.insertId, crm]
                );
            }

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
                    crm: usuarioEhMedico(tipo) ? crm : null,
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
                inst_id,
                crm
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

            const [medicoDoUsuario] = await db.query(
                'SELECT med_id, med_crm FROM Medico WHERE usu_id = ?',
                [id]
            );

            if (usuarioEhMedico(tipo)) {
                if (!crm && medicoDoUsuario.length === 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'CRM e obrigatorio para usuario medico',
                        dados: null
                    });
                }

                if (crm) {
                    const [crmDuplicado] = await db.query(
                        'SELECT med_id FROM Medico WHERE med_crm = ? AND usu_id != ?',
                        [crm, id]
                    );

                    if (crmDuplicado.length > 0) {
                        return response.status(400).json({
                            sucesso: false,
                            mensagem: 'CRM ja cadastrado para outro medico',
                            dados: null
                        });
                    }
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

            if (usuarioEhMedico(tipo)) {
                if (medicoDoUsuario.length > 0 && crm) {
                    await db.query(
                        'UPDATE Medico SET med_crm = ? WHERE usu_id = ?',
                        [crm, id]
                    );
                } else if (medicoDoUsuario.length === 0) {
                    await db.query(
                        'INSERT INTO Medico (usu_id, med_crm) VALUES (?, ?)',
                        [id, crm]
                    );
                }
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
                    crm: usuarioEhMedico(tipo) ? (crm || medicoDoUsuario[0]?.med_crm || null) : null,
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

            const [logs] = await db.query(
                'SELECT log_id FROM Logs_Acao WHERE usu_id = ?',
                [id]
            );

            if (logs.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir usuário com logs de ação registrados',
                    dados: null
                });
            }

            const [mensagens] = await db.query(
                `
                SELECT msg_id
                FROM Mensagem_Chat
                WHERE usu_id_remetente = ?
                   OR usu_id_destinatario = ?
                `,
                [id, id]
            );

            if (mensagens.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nao e possivel excluir usuario com mensagens registradas',
                    dados: null
                });
            }

            const [medico] = await db.query(
                'SELECT med_id FROM Medico WHERE usu_id = ?',
                [id]
            );

            if (medico.length > 0) {
                const medId = medico[0].med_id;

                const [atendimentos] = await db.query(
                    'SELECT atend_id FROM Atendimento WHERE med_id = ?',
                    [medId]
                );

                const [favoritos] = await db.query(
                    'SELECT fav_id FROM Favorito WHERE med_id = ?',
                    [medId]
                );

                if (atendimentos.length > 0 || favoritos.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Nao e possivel excluir usuario medico com atendimentos ou favoritos vinculados',
                        dados: null
                    });
                }

                await db.query(
                    'DELETE FROM Medico WHERE med_id = ?',
                    [medId]
                );
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
