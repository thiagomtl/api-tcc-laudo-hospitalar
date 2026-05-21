const nodemailer = require('nodemailer');

function emailConfigurado() {
    return Boolean(
        process.env.EMAIL_HOST &&
        process.env.EMAIL_PORT &&
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS &&
        process.env.EMAIL_FROM &&
        process.env.EMAIL_SISTEMA
    );
}

function criarTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: String(process.env.EMAIL_SECURE || 'false') === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

async function enviarEmailSistema({ assunto, texto, html, replyTo }) {
    if (!emailConfigurado()) {
        return {
            enviado: false,
            motivo: 'Configuracao de e-mail incompleta no .env.'
        };
    }

    const transporter = criarTransporter();

    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_SISTEMA,
        subject: assunto,
        replyTo,
        text: texto,
        html
    });

    return {
        enviado: true,
        messageId: info.messageId
    };
}

async function enviarEmailPara({ para, assunto, texto, html, replyTo }) {
    if (!emailConfigurado()) {
        return {
            enviado: false,
            motivo: 'Configuracao de e-mail incompleta no .env.'
        };
    }

    const transporter = criarTransporter();

    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: para,
        subject: assunto,
        replyTo,
        text: texto,
        html
    });

    return {
        enviado: true,
        messageId: info.messageId
    };
}

module.exports = {
    enviarEmailSistema,
    enviarEmailPara
};
