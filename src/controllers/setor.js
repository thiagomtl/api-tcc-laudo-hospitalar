const db = require('../dataBase/connection');

module.exports = {

    async listarSetor(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de setores obtida com sucesso`,
                    dados: null
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao obter lista de setores: ${error.message}`,
                    dados: null
                }
            );
        }
    },

    async cadastrarSetor(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de setor realizado com sucesso`,
                    dados: null
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar setor: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async editarSetor(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de setores obtida com sucesso`,
                    dados: null
                }
            );

        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar setores: ${error.message}`,
                    dados: null
                }
            );
        }
    },

    async apagarSetor(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de setores apagada com sucesso`,
                    dados: null
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar lista de setores: ${error.message}`,
                    dados: null
                }
            );
        }
    },
}