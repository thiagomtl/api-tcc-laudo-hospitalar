const { enviarEmailPara } = require('../utils/email');

function campoVazio(valor) {
    return valor === undefined || valor === null || String(valor).trim() === '';
}

function escaparHtml(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function tipoContatoNormalizado(tipoContato) {
    return String(tipoContato || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

async function enviarSms({ telefone, codigo }) {
    if (
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_FROM_NUMBER
    ) {
        const auth = Buffer.from(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString('base64');

        const params = new URLSearchParams({
            To: telefone.startsWith('+') ? telefone : `+55${telefone}`,
            From: process.env.TWILIO_FROM_NUMBER,
            Body: `Seu codigo de confirmacao MedSync e: ${codigo}`
        });

        const resposta = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            }
        );

        const dados = await resposta.json().catch(() => null);

        if (!resposta.ok) {
            return {
                enviado: false,
                motivo: dados?.message || 'Falha ao enviar SMS pela Twilio.',
                dados
            };
        }

        return {
            enviado: true,
            sid: dados?.sid
        };
    }

    if (!process.env.SMS_API_URL || !process.env.SMS_API_TOKEN) {
        return {
            enviado: false,
            motivo: 'Envio por celular indisponivel no momento. Escolha o envio por e-mail ou configure um provedor de SMS.'
        };
    }

    const resposta = await fetch(process.env.SMS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SMS_API_TOKEN}`
        },
        body: JSON.stringify({
            to: telefone,
            message: `Seu codigo de confirmacao MedSync e: ${codigo}`
        })
    });

    if (!resposta.ok) {
        const texto = await resposta.text();

        return {
            enviado: false,
            motivo: texto || 'Falha ao enviar SMS.'
        };
    }

    return {
        enviado: true
    };
}

module.exports = {
    async enviarCodigoConfirmacao(request, response) {
        try {
            const { nome, contato, tipoContato, codigo } = request.body;
            const tipo = tipoContatoNormalizado(tipoContato);

            if (campoVazio(contato) || campoVazio(tipoContato) || campoVazio(codigo)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Contato, tipoContato e codigo sao obrigatorios.',
                    dados: null
                });
            }

            if (!/^\d{6}$/.test(String(codigo))) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Codigo deve ter 6 digitos.',
                    dados: null
                });
            }

            if (tipo === 'email') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato)) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Email invalido.',
                        dados: null
                    });
                }

                const resultadoEmail = await enviarEmailPara({
                    para: contato,
                    assunto: 'Codigo de confirmacao MedSync',
                    texto: [
                        `Ola${campoVazio(nome) ? '' : `, ${nome}`}.`,
                        '',
                        `Seu codigo de confirmacao e: ${codigo}`,
                        '',
                        'Este codigo expira em 5 minutos.'
                    ].join('\n'),
                    html: `
                        <h2>Codigo de confirmacao MedSync</h2>
                        <p>Ola${campoVazio(nome) ? '' : `, ${escaparHtml(nome)}`}.</p>
                        <p>Seu codigo de confirmacao e:</p>
                        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${escaparHtml(codigo)}</p>
                        <p>Este codigo expira em 5 minutos.</p>
                    `
                });

                if (!resultadoEmail.enviado) {
                    return response.status(500).json({
                        sucesso: false,
                        mensagem: resultadoEmail.motivo,
                        dados: resultadoEmail
                    });
                }

                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Codigo enviado por e-mail com sucesso.',
                    dados: resultadoEmail
                });
            }

            if (tipo === 'celular' || tipo === 'telefone' || tipo === 'sms') {
                const telefone = String(contato).replace(/\D/g, '');

                if (telefone.length < 10 || telefone.length > 11) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Telefone invalido.',
                        dados: null
                    });
                }

                const resultadoSms = await enviarSms({ telefone, codigo });

                if (!resultadoSms.enviado) {
                    return response.status(500).json({
                        sucesso: false,
                        mensagem: resultadoSms.motivo,
                        dados: resultadoSms
                    });
                }

                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Codigo enviado por SMS com sucesso.',
                    dados: resultadoSms
                });
            }

            return response.status(400).json({
                sucesso: false,
                mensagem: 'Tipo de contato invalido.',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao enviar codigo de confirmacao: ${error.message}`,
                dados: error.message
            });
        }
    }
};
