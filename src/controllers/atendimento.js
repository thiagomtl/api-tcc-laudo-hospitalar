const db = require('../database/connection');

module.exports = {
    async listarAtendimento(request, response) {
        try {
            return response.status(200).jason(
                {
                    sucesso: true,
                    mensagem: 'Lista de atendimento obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).jason(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarAtendimento(request, response) {
        try {
            return response.status(200).jason(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de atendimento obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).jason(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async editarAtendimento(request, response) {
        try {
            return response.status(200).jason(
                {
                    sucesso: true,
                    mensagem: 'Atualização de atendimento obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).jason(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarAtendimento(request, response) {
        try {
            return response.status(200).jason(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de atendimento obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).jason(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}