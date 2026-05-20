const clientes = new Set();
const notificacoes = [];
const LIMITE_NOTIFICACOES = 50;

function enviarEvento(response, notificacao) {
    response.write(`event: notificacao\n`);
    response.write(`data: ${JSON.stringify(notificacao)}\n\n`);
}

function criarNotificacao({ tipo, titulo, mensagem, dados = null }) {
    const notificacao = {
        id: Date.now(),
        tipo,
        titulo,
        mensagem,
        dados,
        lida: false,
        criadaEm: new Date().toISOString()
    };

    notificacoes.unshift(notificacao);

    if (notificacoes.length > LIMITE_NOTIFICACOES) {
        notificacoes.pop();
    }

    clientes.forEach((cliente) => enviarEvento(cliente, notificacao));

    return notificacao;
}

function listarNotificacoes() {
    return notificacoes;
}

function conectarCliente(request, response) {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders?.();

    clientes.add(response);

    response.write(`event: conectado\n`);
    response.write(`data: ${JSON.stringify({ sucesso: true })}\n\n`);

    request.on('close', () => {
        clientes.delete(response);
        response.end();
    });
}

module.exports = {
    conectarCliente,
    criarNotificacao,
    listarNotificacoes
};
