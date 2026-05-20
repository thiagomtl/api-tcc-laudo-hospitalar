const {
    conectarCliente,
    listarNotificacoes
} = require('../utils/notificacoes');

module.exports = {
    async listarNotificacoes(request, response) {
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de notificacoes obtida com sucesso',
            itens: listarNotificacoes().length,
            dados: listarNotificacoes()
        });
    },

    async acompanharNotificacoes(request, response) {
        conectarCliente(request, response);
    }
};
