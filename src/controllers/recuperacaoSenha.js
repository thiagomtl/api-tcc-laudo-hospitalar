const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../dataBase/connection');
const { enviarEmailPara } = require('../utils/email');

const recuperacoes = new Map();
const TEMPO_EXPIRACAO_MS = 5 * 60 * 1000;

function somenteNumeros(valor) {
    return String(valor || '').replace(/\D/g, '');
}

function gerarCodigo() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function mascararEmail(email) {
    const [nome = '', dominio = ''] = String(email || '').split('@');

    if (!nome || !dominio) return '';

    const inicio = nome.slice(0, 2);
    const fim = nome.length > 4 ? nome.slice(-2) : '';

    return `${inicio}${'*'.repeat(Math.max(nome.length - inicio.length - fim.length, 3))}${fim}@${dominio}`;
}

function mascararTelefone(telefone) {
    const numeros = somenteNumeros(telefone);

    if (numeros.length < 10) return '';

    return `(${numeros.slice(0, 2)}) ${'*'.repeat(5)}-${numeros.slice(-4)}`;
}

async function buscarUsuarioPorCpf(cpf) {
    const [usuarios] = await db.query(
        `
        SELECT usu_id, usu_nome, usu_documento, usu_email, usu_telefone
        FROM Usuario
        WHERE usu_documento = ? AND usu_status = 1
        LIMIT 1
        `,
        [cpf]
    );

    return usuarios[0] || null;
}

function obterRecuperacao(cpf) {
    const recuperacao = recuperacoes.get(cpf);

    if (!recuperacao || recuperacao.expiraEm < Date.now()) {
        recuperacoes.delete(cpf);
        return null;
    }

    return recuperacao;
}

module.exports = {
    async buscarUsuario(request, response) {
        try {
            const cpf = somenteNumeros(request.body.cpf);

            if (cpf.length !== 11) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF deve conter 11 digitos.',
                    dados: null
                });
            }

            const usuario = await buscarUsuarioPorCpf(cpf);

            if (!usuario) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'CPF nao cadastrado no sistema.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Usuario encontrado.',
                dados: {
                    nome: usuario.usu_nome,
                    cpf,
                    emailMascarado: mascararEmail(usuario.usu_email),
                    telefoneMascarado: mascararTelefone(usuario.usu_telefone),
                    possuiEmail: Boolean(usuario.usu_email),
                    possuiTelefone: somenteNumeros(usuario.usu_telefone).length >= 10
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao buscar usuario: ${error.message}`,
                dados: null
            });
        }
    },

    async enviarCodigo(request, response) {
        try {
            const cpf = somenteNumeros(request.body.cpf);
            const tipoContato = String(request.body.tipoContato || '').toLowerCase();

            if (cpf.length !== 11) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF deve conter 11 digitos.',
                    dados: null
                });
            }

            if (!['email', 'celular', 'telefone'].includes(tipoContato)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Escolha uma forma valida de envio.',
                    dados: null
                });
            }

            const usuario = await buscarUsuarioPorCpf(cpf);

            if (!usuario) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'CPF nao cadastrado no sistema.',
                    dados: null
                });
            }

            if (tipoContato === 'email' && !usuario.usu_email) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Este usuario nao possui e-mail cadastrado.',
                    dados: null
                });
            }

            if (tipoContato !== 'email') {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Envio por celular ainda nao esta disponivel. Escolha o e-mail.',
                    dados: null
                });
            }

            const codigo = gerarCodigo();

            const resultadoEmail = await enviarEmailPara({
                para: usuario.usu_email,
                assunto: 'Codigo para redefinir senha MedSync',
                texto: [
                    `Ola, ${usuario.usu_nome}.`,
                    '',
                    `Seu codigo para redefinir a senha e: ${codigo}`,
                    '',
                    'Este codigo expira em 5 minutos.'
                ].join('\n'),
                html: `
                    <h2>Redefinicao de senha MedSync</h2>
                    <p>Ola, ${usuario.usu_nome}.</p>
                    <p>Seu codigo para redefinir a senha e:</p>
                    <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${codigo}</p>
                    <p>Este codigo expira em 5 minutos.</p>
                `
            });

            if (!resultadoEmail.enviado) {
                return response.status(500).json({
                    sucesso: false,
                    mensagem: resultadoEmail.motivo || 'Nao foi possivel enviar o codigo.',
                    dados: null
                });
            }

            recuperacoes.set(cpf, {
                usuarioId: usuario.usu_id,
                codigo,
                expiraEm: Date.now() + TEMPO_EXPIRACAO_MS,
                token: null
            });

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Codigo enviado com sucesso.',
                dados: {
                    destino: mascararEmail(usuario.usu_email)
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao enviar codigo: ${error.message}`,
                dados: null
            });
        }
    },

    async validarCodigo(request, response) {
        try {
            const cpf = somenteNumeros(request.body.cpf);
            const codigo = String(request.body.codigo || '').trim();
            const recuperacao = obterRecuperacao(cpf);

            if (!recuperacao) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Codigo expirado. Solicite um novo codigo.',
                    dados: null
                });
            }

            if (!/^\d{6}$/.test(codigo) || recuperacao.codigo !== codigo) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Codigo invalido.',
                    dados: null
                });
            }

            const token = crypto.randomBytes(24).toString('hex');
            recuperacoes.set(cpf, {
                ...recuperacao,
                token
            });

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Codigo confirmado.',
                dados: {
                    token
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao validar codigo: ${error.message}`,
                dados: null
            });
        }
    },

    async redefinirSenha(request, response) {
        try {
            const { token, novaSenha, confirmarSenha } = request.body;

            if (!token || !novaSenha || !confirmarSenha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Token, nova senha e confirmacao sao obrigatorios.',
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

            if (novaSenha !== confirmarSenha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'A nova senha e a confirmacao precisam ser iguais.',
                    dados: null
                });
            }

            const entrada = Array.from(recuperacoes.entries()).find(([, valor]) => (
                valor.token === token && valor.expiraEm >= Date.now()
            ));

            if (!entrada) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Solicitacao expirada. Reinicie a recuperacao de senha.',
                    dados: null
                });
            }

            const [cpf, recuperacao] = entrada;
            const senhaHash = await bcrypt.hash(String(novaSenha), 10);

            await db.query(
                'UPDATE Usuario SET usu_senha = ? WHERE usu_id = ?',
                [senhaHash, recuperacao.usuarioId]
            );

            recuperacoes.delete(cpf);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Senha redefinida com sucesso.',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao redefinir senha: ${error.message}`,
                dados: null
            });
        }
    }
};
