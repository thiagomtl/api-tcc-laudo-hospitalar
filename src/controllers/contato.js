const { enviarEmailSistema } = require('../utils/email');

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

module.exports = {
    async enviarContato(request, response) {
        try {
            const {
                nome,
                email,
                telefone,
                assunto = 'Contato pelo site',
                mensagem
            } = request.body;

            const camposObrigatorios = [];

            if (campoVazio(nome)) camposObrigatorios.push('nome');
            if (campoVazio(email)) camposObrigatorios.push('email');
            if (campoVazio(mensagem)) camposObrigatorios.push('mensagem');

            if (camposObrigatorios.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `Campos obrigatorios ausentes: ${camposObrigatorios.join(', ')}.`,
                    dados: null
                });
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email invalido.',
                    dados: null
                });
            }

            const resultadoEmail = await enviarEmailSistema({
                assunto: `Contato MedSync: ${assunto}`,
                replyTo: email,
                texto: [
                    'Nova mensagem recebida pela tela de contato.',
                    '',
                    `Nome: ${nome}`,
                    `Email: ${email}`,
                    `Telefone: ${telefone || 'Nao informado'}`,
                    `Assunto: ${assunto}`,
                    '',
                    'Mensagem:',
                    mensagem
                ].join('\n'),
                html: `
                    <h2>Nova mensagem da tela de contato</h2>
                    <p><strong>Nome:</strong> ${escaparHtml(nome)}</p>
                    <p><strong>Email:</strong> ${escaparHtml(email)}</p>
                    <p><strong>Telefone:</strong> ${escaparHtml(telefone || 'Nao informado')}</p>
                    <p><strong>Assunto:</strong> ${escaparHtml(assunto)}</p>
                    <p><strong>Mensagem:</strong></p>
                    <p>${escaparHtml(mensagem).replace(/\n/g, '<br>')}</p>
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
                mensagem: 'Mensagem de contato enviada com sucesso.',
                dados: resultadoEmail
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao enviar mensagem de contato: ${error.message}`,
                dados: error.message
            });
        }
    }
};
