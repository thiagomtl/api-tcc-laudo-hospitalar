const jwt = require('jsonwebtoken');

function normalizarTipoUsuario(tipo) {
    return String(tipo || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function autenticarToken(request, response, next) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({
            sucesso: false,
            mensagem: 'Token não informado.',
            dados: null
        });
    }

    const partes = authHeader.split(' ');

    if (partes.length !== 2) {
        return response.status(401).json({
            sucesso: false,
            mensagem: 'Token mal formatado.',
            dados: null
        });
    }

    const [tipo, token] = partes;

    if (tipo !== 'Bearer') {
        return response.status(401).json({
            sucesso: false,
            mensagem: 'Tipo de token inválido.',
            dados: null
        });
    }

    try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);

        request.usuario = usuario;

        return next();
    } catch (error) {
        return response.status(401).json({
            sucesso: false,
            mensagem: 'Token inválido ou expirado.',
            dados: null
        });
    }
}

function somenteAdministrador(request, response, next) {
    if (normalizarTipoUsuario(request.usuario?.tipo) !== 'administrador') {
        return response.status(403).json({
            sucesso: false,
            mensagem: 'Acesso permitido apenas para administradores.',
            dados: null
        });
    }

    return next();
}

function somenteMedico(request, response, next) {
    if (normalizarTipoUsuario(request.usuario?.tipo) !== 'medico') {
        return response.status(403).json({
            sucesso: false,
            mensagem: 'Acesso permitido apenas para médicos.',
            dados: null
        });
    }

    return next();
}

function somenteFaturista(request, response, next) {
    if (normalizarTipoUsuario(request.usuario?.tipo) !== 'faturista') {
        return response.status(403).json({
            sucesso: false,
            mensagem: 'Acesso permitido apenas para faturistas.',
            dados: null
        });
    }

    return next();
}

module.exports = {
    autenticarToken,
    somenteAdministrador,
    somenteMedico,
    somenteFaturista
};
