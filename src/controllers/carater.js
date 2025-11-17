const db = require('..database/connection');

module.exports = {

    async listarCarater(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de carater obtida com sucesso`,
                    dados: null
                }
            );
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao obter lista de carater: ${error.message}`,
                    dados: null
                }
            );
        }
    },

    async cadastrarCarater(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de carater realizado com sucesso`,
                    dados: null
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastra carater: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async editarCarater(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de carater obtida com sucesso`,
                    dados: null
                }
            );
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar carater: ${error.message}`,
                    dados: null
                }
            );
        }
    },

    async apagarCarater(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de carater apagada com sucesso`,
                    dados: null
                }
            );
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar lista de carater: ${error.message}`,
                    dados: null
                }
            );
        }
    },
}