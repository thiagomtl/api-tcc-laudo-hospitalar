const db = require('../database/connection');

module.exports = {
    async listarConvenio(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de convênio obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao convênio atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarConvenio(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de convênio obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar convênio: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async editarConvenio(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de convênio obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar convênio: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarConvenio(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de convênio obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar convênio: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}