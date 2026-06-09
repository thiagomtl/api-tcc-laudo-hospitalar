const db = require('../dataBase/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registrarLog } = require("./logsAcao");
const normalizarTextoLaudo = require('../utils/normalizarTextoLaudo');

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

function normalizarCrm(crm) {
    return String(crm || '').replace(/\D/g, '').slice(0, 6);
}

function normalizarUsuarioAcesso(usuario) {
    return String(usuario || '').trim().toLowerCase();
}

function normalizarCampoOpcional(valor) {
    if (valor === undefined) {
        return undefined;
    }

    if (valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto || null;
}

function campoFoiInformado(body, campoPrincipal, campoAlternativo) {
    return Object.prototype.hasOwnProperty.call(body, campoPrincipal) ||
        Object.prototype.hasOwnProperty.call(body, campoAlternativo);
}

function obterCampoOpcional(body, campoPrincipal, campoAlternativo) {
    if (Object.prototype.hasOwnProperty.call(body, campoPrincipal)) {
        return body[campoPrincipal];
    }

    return body[campoAlternativo];
}

function crmValido(crm) {
    return /^\d{6}$/.test(String(crm || ''));
}

function normalizarTipoUsuario(tipo) {
    return String(tipo || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function usuarioEhMedico(tipo) {
    return normalizarTipoUsuario(tipo) === 'medico';
}

function usuarioPodeAlterarCrm(tipo) {
    return normalizarTipoUsuario(tipo) === 'medico';
}

function obterUsuarioAutenticadoId(request) {
    return request.usuario?.usu_id || request.usuario?.id || null;
}

function usuarioAutenticadoEhAlvo(request, usuarioId) {
    const usuarioAutenticadoId = obterUsuarioAutenticadoId(request);

    return usuarioAutenticadoId !== null && Number(usuarioAutenticadoId) === Number(usuarioId);
}

function tipoUsuarioParaResposta(tipo) {
    const tipoNormalizado = normalizarTipoUsuario(tipo);

    if (tipoNormalizado === 'administrador') {
        return 'Administrador';
    }

    if (tipoNormalizado === 'faturista') {
        return 'Faturista';
    }

    if (tipoNormalizado === 'medico') {
        return 'Médico';
    }

    return tipo;
}

function usuarioParaResposta(usuario) {
    if (!usuario) {
        return usuario;
    }

    return {
        ...usuario,
        usu_tipo: tipoUsuarioParaResposta(usuario.usu_tipo),
        tipo: tipoUsuarioParaResposta(usuario.usu_tipo || usuario.tipo)
    };
}

async function buscarPerfilPorId(usuarioId) {
    const [rows] = await db.query(
        `
        SELECT
            u.usu_id,
            u.usu_nome,
            u.usu_usuario,
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
            m.med_crm,
            m.med_crm AS usu_crm,
            m.med_especialidade,
            m.med_assinatura
        FROM Usuario u
        LEFT JOIN Instituicao i ON i.inst_id = u.inst_id
        LEFT JOIN Medico m ON m.usu_id = u.usu_id
        WHERE u.usu_id = ?
        `,
        [usuarioId]
    );

    return usuarioParaResposta(rows[0] || null);
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
                u.usu_usuario,
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
                m.med_crm,
                m.med_crm AS usu_crm,
                m.med_especialidade,
                m.med_assinatura
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
                dados: usuarioParaResposta(rows[0])
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

            const {
                telefone,
                crm
            } = request.body;
            const telefoneNumeros = String(telefone || '').replace(/\D/g, '');
            const especialidadeInformada = campoFoiInformado(request.body, 'med_especialidade', 'especialidade');
            const assinaturaInformada = campoFoiInformado(request.body, 'med_assinatura', 'assinatura');
            const especialidadeTratada = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_especialidade', 'especialidade')
            );
            const assinaturaTratada = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_assinatura', 'assinatura')
            );
            const medicoFoiInformado = crm !== undefined || especialidadeInformada || assinaturaInformada;
            const perfilAtual = await buscarPerfilPorId(usuarioId);

            if (!perfilAtual) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuario nao encontrado.',
                    dados: null
                });
            }

            if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Telefone deve ter DDD e 10 ou 11 digitos.',
                    dados: null
                });
            }

            if (medicoFoiInformado && !usuarioPodeAlterarCrm(perfilAtual.usu_tipo)) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Dados de medico nao podem ser alterados neste perfil.',
                    dados: null
                });
            }

            await db.query(
                'UPDATE Usuario SET usu_telefone = ? WHERE usu_id = ?',
                [telefoneNumeros, usuarioId]
            );

            if (medicoFoiInformado && usuarioPodeAlterarCrm(perfilAtual.usu_tipo)) {
                const crmTratado = crm !== undefined ? normalizarCrm(crm) : undefined;

                const [medicoDoUsuario] = await db.query(
                    'SELECT usu_id, med_crm, med_especialidade, med_assinatura FROM Medico WHERE usu_id = ?',
                    [usuarioId]
                );

                if (crm !== undefined && !crmTratado) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'CRM e obrigatorio para usuario medico.',
                        dados: null
                    });
                }

                if (crmTratado !== undefined && !crmValido(crmTratado)) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'CRM deve conter exatamente 6 digitos.',
                        dados: null
                    });
                }

                if (crmTratado !== undefined) {
                    const [crmDuplicado] = await db.query(
                        'SELECT usu_id FROM Medico WHERE med_crm = ? AND usu_id != ?',
                        [crmTratado, usuarioId]
                    );

                    if (crmDuplicado.length > 0) {
                        return response.status(400).json({
                            sucesso: false,
                            mensagem: 'CRM ja cadastrado para outro medico.',
                            dados: null
                        });
                    }
                }

                const especialidadeAtualizada = especialidadeInformada
                    ? especialidadeTratada
                    : (medicoDoUsuario[0]?.med_especialidade ?? null);
                const assinaturaAtualizada = assinaturaInformada
                    ? assinaturaTratada
                    : (medicoDoUsuario[0]?.med_assinatura ?? null);

                if (medicoDoUsuario.length > 0) {
                    await db.query(
                        'UPDATE Medico SET med_crm = COALESCE(?, med_crm), med_especialidade = ?, med_assinatura = ? WHERE usu_id = ?',
                        [
                            crmTratado || null,
                            especialidadeAtualizada,
                            assinaturaAtualizada,
                            usuarioId
                        ]
                    );
                } else {
                    if (!crmTratado) {
                        return response.status(400).json({
                            sucesso: false,
                            mensagem: 'CRM e obrigatorio para usuario medico.',
                            dados: null
                        });
                    }

                    await db.query(
                        'INSERT INTO Medico (usu_id, med_crm, med_especialidade, med_assinatura) VALUES (?, ?, ?, ?)',
                        [
                            usuarioId,
                            crmTratado,
                            especialidadeAtualizada,
                            assinaturaAtualizada
                        ]
                    );
                }
            }

            await registrarLog({
                usuarioId,
                acao: 'EDICAO_PERFIL',
                descricao: `Usuario atualizou o proprio perfil: ID ${usuarioId}`
            });

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

            const { emailAtual, novoEmail, confirmarNovoEmail } = request.body;
            const emailAtualTratado = String(emailAtual || '').trim().toLowerCase();
            const novoEmailTratado = String(novoEmail || '').trim().toLowerCase();
            const confirmarNovoEmailTratado = String(confirmarNovoEmail || '').trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailAtualTratado || !novoEmailTratado || !confirmarNovoEmailTratado) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Todos os campos devem ser preenchidos.',
                    dados: null
                });
            }

            if (!emailRegex.test(novoEmailTratado)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Novo email invalido.',
                    dados: null
                });
            }

            if (novoEmailTratado !== confirmarNovoEmailTratado) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O novo email e a confirmacao precisam ser iguais.',
                    dados: null
                });
            }

            const [usuarioAtual] = await db.query(
                'SELECT usu_id, usu_email FROM Usuario WHERE usu_id = ?',
                [usuarioId]
            );

            if (usuarioAtual.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuario nao encontrado.',
                    dados: null
                });
            }

            if (String(usuarioAtual[0].usu_email || '').trim().toLowerCase() !== emailAtualTratado) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email atual incorreto.',
                    dados: null
                });
            }

            if (emailAtualTratado === novoEmailTratado) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O novo email deve ser diferente do email atual.',
                    dados: null
                });
            }

            const [emailDuplicado] = await db.query(
                'SELECT usu_id FROM Usuario WHERE LOWER(usu_email) = ? AND usu_id != ?',
                [novoEmailTratado, usuarioId]
            );

            if (emailDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email ja cadastrado para outro usuario.',
                    dados: null
                });
            }

            await db.query(
                'UPDATE Usuario SET usu_email = ? WHERE usu_id = ?',
                [novoEmailTratado, usuarioId]
            );

            await registrarLog({
                usuarioId,
                acao: 'ALTERACAO_EMAIL',
                descricao: `Usuario alterou o proprio email: ID ${usuarioId}`
            });

            const perfilAtualizado = await buscarPerfilPorId(usuarioId);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Email alterado com sucesso.',
                dados: perfilAtualizado
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao alterar email: ${error.message}`,
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

            const { senhaAtual, novaSenha, confirmarNovaSenha } = request.body;

            if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Todos os campos devem ser preenchidos.',
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

            if (novaSenha !== confirmarNovaSenha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'A nova senha e a confirmacao precisam ser iguais.',
                    dados: null
                });
            }

            const [usuarioAtual] = await db.query(
                'SELECT usu_id, usu_senha FROM Usuario WHERE usu_id = ?',
                [usuarioId]
            );

            if (usuarioAtual.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuario nao encontrado.',
                    dados: null
                });
            }

            const senhaAtualValida = await bcrypt.compare(
                String(senhaAtual),
                usuarioAtual[0].usu_senha
            );

            if (!senhaAtualValida) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Senha atual incorreta.',
                    dados: null
                });
            }

            const novaSenhaIgualAtual = await bcrypt.compare(
                String(novaSenha),
                usuarioAtual[0].usu_senha
            );

            if (novaSenhaIgualAtual) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'A nova senha deve ser diferente da senha atual.',
                    dados: null
                });
            }

            const novaSenhaHash = await bcrypt.hash(String(novaSenha), 10);

            await db.query(
                'UPDATE Usuario SET usu_senha = ? WHERE usu_id = ?',
                [novaSenhaHash, usuarioId]
            );

            await registrarLog({
                usuarioId,
                acao: 'ALTERACAO_SENHA',
                descricao: `Usuario alterou a propria senha: ID ${usuarioId}`
            });

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Senha alterada com sucesso.',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao alterar senha: ${error.message}`,
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
                    m.med_crm,
                    m.med_especialidade,
                    m.med_assinatura
                FROM Usuario u
                LEFT JOIN Medico m ON m.usu_id = u.usu_id
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuário obtida com sucesso',
                itens: rows.length,
                dados: rows.map(usuarioParaResposta)
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
            const identificador = String(request.body.identificador || request.body.email || '').trim();
            const { senha } = request.body;

            if (!identificador || !senha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email e senha são obrigatórios.',
                    dados: null
                });
            }

            const identificadorEmail = identificador.toLowerCase();
            const identificadorDocumento = identificador.replace(/\D/g, '');
            const identificadorUsuario = normalizarUsuarioAcesso(identificador);

            const sql = `
                SELECT
                    u.usu_id,
                    u.usu_nome,
                    u.usu_usuario,
                    u.usu_documento,
                    u.usu_email,
                    u.usu_senha,
                    u.usu_tipo,
                    u.inst_id,
                    i.inst_nome,
                    CAST(u.usu_status AS UNSIGNED) AS usu_status,
                    m.med_crm,
                    m.med_especialidade,
                    m.med_assinatura
                FROM Usuario u
                LEFT JOIN Instituicao i ON i.inst_id = u.inst_id
                LEFT JOIN Medico m ON m.usu_id = u.usu_id
                WHERE u.usu_status = 1
                  AND (
                    LOWER(u.usu_email) = ?
                    OR u.usu_documento = ?
                    OR LOWER(u.usu_usuario) = ?
                    OR LOWER(u.usu_nome) = ?
                  )
            `;

            const [rows] = await db.query(sql, [
                identificadorEmail,
                identificadorDocumento,
                identificadorUsuario,
                identificadorUsuario
            ]);

            if (rows.length < 1) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Login e/ou senha incorretos',
                    dados: null
                });
            }

            const usuario = usuarioParaResposta(rows[0]);

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
                    usuario: usuario.usu_usuario,
                    email: usuario.usu_email,
                    tipo: usuario.usu_tipo,
                    inst_id: usuario.inst_id
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            await registrarLog({
                usuarioId: usuario.usu_id,
                acao: "LOGIN",
                descricao: `Usuário ${usuario.usu_nome} realizou login`
            });

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
                usuario,
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

            const nomeNormalizado = normalizarTextoLaudo(nome);
            const usuarioNormalizado = normalizarUsuarioAcesso(usuario);
            const especialidadeTratada = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_especialidade', 'especialidade')
            );
            const assinaturaTratada = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_assinatura', 'assinatura')
            );

            const dadosValidacao = {
                usu_nome: nomeNormalizado,
                usu_usuario: usuarioNormalizado,
                usu_documento: documento,
                usu_email: email,
                usu_senha: senha,
                inst_id,
                usu_telefone: telefone,
                usu_tipo: tipo,
                usu_status: Number(status)
            };

            const erros = validarUsuario(dadosValidacao);
            const crmNormalizado = normalizarCrm(crm);

            if (!usuarioNormalizado) {
                erros.push('Usuario e obrigatorio');
            }

            if (usuarioEhMedico(tipo) && !crmNormalizado) {
                erros.push('CRM e obrigatorio para usuario medico');
            }

            if (usuarioEhMedico(tipo) && crmNormalizado && !crmValido(crmNormalizado)) {
                erros.push('CRM deve conter exatamente 6 digitos');
            }

            if (erros.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Erros de validação',
                    erros
                });
            }

            const [instExistente] = await db.query(
                'SELECT inst_id, inst_nome FROM Instituicao WHERE inst_id = ?',
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

            const [usuarioExistente] = await db.query(
                'SELECT usu_id FROM Usuario WHERE LOWER(usu_usuario) = ?',
                [usuarioNormalizado]
            );

            if (usuarioExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuario ja cadastrado',
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
                    'SELECT usu_id FROM Medico WHERE med_crm = ?',
                    [crmNormalizado]
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
                    usu_usuario,
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
                ) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                nomeNormalizado,
                usuarioNormalizado,
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
                    'INSERT INTO Medico (usu_id, med_crm, med_especialidade, med_assinatura) VALUES (?, ?, ?, ?)',
                    [
                        result.insertId,
                        crmNormalizado,
                        especialidadeTratada ?? null,
                        assinaturaTratada ?? null
                    ]
                );
            }

            await registrarLog({
                usuarioId: request.usuario?.usu_id || request.usuario?.id || null,
                acao: "CADASTRO_USUARIO",
                descricao: `Usuário cadastrado: ${nomeNormalizado}`
            });

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Usuário cadastrado',
                dados: {
                    id: result.insertId,
                    nome: nomeNormalizado,
                    usuario: usuarioNormalizado,
                    documento,
                    email,
                    telefone,
                    tipo: tipoUsuarioParaResposta(tipo),
                    crm: usuarioEhMedico(tipo) ? crmNormalizado : null,
                    especialidade: usuarioEhMedico(tipo) ? (especialidadeTratada ?? null) : null,
                    assinatura: usuarioEhMedico(tipo) ? (assinaturaTratada ?? null) : null,
                    med_especialidade: usuarioEhMedico(tipo) ? (especialidadeTratada ?? null) : null,
                    med_assinatura: usuarioEhMedico(tipo) ? (assinaturaTratada ?? null) : null,
                    inst_id,
                    inst_nome: instExistente[0].inst_nome,
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
            const nomeNormalizado = normalizarTextoLaudo(nome);
            const especialidadeInformada = campoFoiInformado(request.body, 'med_especialidade', 'especialidade');
            const assinaturaInformada = campoFoiInformado(request.body, 'med_assinatura', 'assinatura');
            const especialidadeTratada = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_especialidade', 'especialidade')
            );
            const assinaturaTratada = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_assinatura', 'assinatura')
            );

            const [usuarioExistente] = await db.query(
                'SELECT usu_id, usu_email, usu_documento, CAST(usu_status AS UNSIGNED) AS usu_status FROM Usuario WHERE usu_id = ?',
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
                usu_nome: nomeNormalizado,
                usu_documento: documento,
                usu_email: email,
                usu_senha: senha || "senha_nao_alterada",
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
                'SELECT inst_id, inst_nome FROM Instituicao WHERE inst_id = ?',
                [inst_id]
            );

            if (instExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Instituição não encontrada',
                    dados: null
                });
            }

            if (
                usuarioAutenticadoEhAlvo(request, id) &&
                Number(status) !== Number(usuarioExistente[0].usu_status)
            ) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Nao e possivel alterar o status do proprio usuario',
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
                'SELECT usu_id, med_crm, med_especialidade, med_assinatura FROM Medico WHERE usu_id = ?',
                [id]
            );
            const crmNormalizado = normalizarCrm(crm);
            const especialidadeAtualizada = especialidadeInformada
                ? especialidadeTratada
                : (medicoDoUsuario[0]?.med_especialidade ?? null);
            const assinaturaAtualizada = assinaturaInformada
                ? assinaturaTratada
                : (medicoDoUsuario[0]?.med_assinatura ?? null);

            if (usuarioEhMedico(tipo)) {
                if (!crmNormalizado && medicoDoUsuario.length === 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'CRM e obrigatorio para usuario medico',
                        dados: null
                    });
                }

                if (crmNormalizado && !crmValido(crmNormalizado)) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'CRM deve conter exatamente 6 digitos',
                        dados: null
                    });
                }

                if (crmNormalizado) {
                    const [crmDuplicado] = await db.query(
                        'SELECT usu_id FROM Medico WHERE med_crm = ? AND usu_id != ?',
                        [crmNormalizado, id]
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

            let sql = `
            UPDATE Usuario
            SET
                usu_nome = ?,
                usu_documento = ?,
                usu_email = ?,
                inst_id = ?,
                usu_telefone = ?,
                usu_tipo = ?,
                usu_status = ?
            `;

            const values = [
                nome,
                documento,
                email,
                inst_id,
                telefone,
                tipo,
                Number(status)
            ];

            if (senha && senha.trim() !== "") {
                const senhaCriptografada = await bcrypt.hash(senha, 10);

                sql += `,
                usu_senha = ?
            `;

                values.push(senhaCriptografada);
            }

            sql += `
            WHERE usu_id = ?
            `;

            values.push(id);

            const [result] = await db.query(sql, values);

            await registrarLog({
                usuarioId: request.usuario?.usu_id || request.usuario?.id || null,
                acao: "EDICAO_USUARIO",
                descricao: `Usuário editado: ID ${id}`
            });

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} não encontrado!`,
                    dados: null
                });
            }

            if (usuarioEhMedico(tipo)) {
                if (medicoDoUsuario.length > 0) {
                    await db.query(
                        'UPDATE Medico SET med_crm = COALESCE(?, med_crm), med_especialidade = ?, med_assinatura = ? WHERE usu_id = ?',
                        [
                            crmNormalizado || null,
                            especialidadeAtualizada,
                            assinaturaAtualizada,
                            id
                        ]
                    );
                } else if (medicoDoUsuario.length === 0) {
                    await db.query(
                        'INSERT INTO Medico (usu_id, med_crm, med_especialidade, med_assinatura) VALUES (?, ?, ?, ?)',
                        [
                            id,
                            crmNormalizado,
                            especialidadeAtualizada,
                            assinaturaAtualizada
                        ]
                    );
                }
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} atualizado com sucesso!`,
                dados: {
                    id: Number(id),
                    nome: nomeNormalizado,
                    documento,
                    email,
                    telefone,
                    tipo: tipoUsuarioParaResposta(tipo),
                    crm: usuarioEhMedico(tipo) ? (crmNormalizado || medicoDoUsuario[0]?.med_crm || null) : null,
                    especialidade: usuarioEhMedico(tipo) ? especialidadeAtualizada : null,
                    assinatura: usuarioEhMedico(tipo) ? assinaturaAtualizada : null,
                    med_especialidade: usuarioEhMedico(tipo) ? especialidadeAtualizada : null,
                    med_assinatura: usuarioEhMedico(tipo) ? assinaturaAtualizada : null,
                    inst_id,
                    inst_nome: instExistente[0].inst_nome,
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

            if (usuarioAutenticadoEhAlvo(request, id)) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Nao e possivel ocultar o proprio usuario',
                    dados: null
                });
            }

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

            await registrarLog({
                usuarioId: request.usuario?.usu_id || request.usuario?.id || null,
                acao: "OCULTAR_USUARIO",
                descricao: `Usuário ocultado: ID ${id}`
            });

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

            if (usuarioAutenticadoEhAlvo(request, id)) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Nao e possivel ativar o proprio usuario',
                    dados: null
                });
            }

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

            await registrarLog({
                usuarioId: request.usuario?.usu_id || request.usuario?.id || null,
                acao: "ATIVAR_USUARIO",
                descricao: `Usuário ativado: ID ${id}`
            });

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

            if (usuarioAutenticadoEhAlvo(request, id)) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Nao e possivel excluir o proprio usuario',
                    dados: null
                });
            }

            const [usuarioExistente] = await db.query(
                `
            SELECT usu_id, usu_nome
            FROM Usuario
            WHERE usu_id = ?
            `,
                [id]
            );

            if (usuarioExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado',
                    dados: null
                });
            }

            const usuarioApagado = usuarioExistente[0];

            const [logs] = await db.query(
                'SELECT log_id FROM Logs_Acao WHERE usu_id = ?',
                [id]
            );

            if (logs.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Este usuário possui histórico no sistema. Por segurança, ele não pode ser excluído, utilize a opção de ocultar/ativar para alterar o status do usuário.',
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
                'SELECT usu_id FROM Medico WHERE usu_id = ?',
                [id]
            );

            if (medico.length > 0) {
                const [atendimentos] = await db.query(
                    'SELECT atend_id FROM Atendimento WHERE usu_id = ?',
                    [id]
                );

                const [favoritos] = await db.query(
                    'SELECT fav_id FROM Favorito WHERE usu_id = ?',
                    [id]
                );

                if (atendimentos.length > 0 || favoritos.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Nao e possivel excluir usuario medico com atendimentos ou favoritos vinculados',
                        dados: null
                    });
                }

                await db.query(
                    'DELETE FROM Medico WHERE usu_id = ?',
                    [id]
                );
            }

            await db.query(
                'DELETE FROM Usuario WHERE usu_id = ?',
                [id]
            );

            await registrarLog({
                usuarioId: request.usuario?.usu_id || request.usuario?.id || null,
                acao: "APAGAR_USUARIO",
                descricao: `Usuário excluído: ${usuarioApagado.usu_nome} - ID ${id}`
            });

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
