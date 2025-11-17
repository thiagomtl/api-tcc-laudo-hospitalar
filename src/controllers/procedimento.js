const db = require('../dataBase/connection');

module.exports = {
    
    async listarProcedimento(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de procedimentos obtidas com sucesso`,
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar procedimentos: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async cadastrarProcedimento(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de procedimentos realizados com sucesso`,
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar procedimentos: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async editarProcedimento(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de procedimentos realizados com sucesso`,
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar procedimentos: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async apagarProcedimento(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de procedimentos realizados com sucesso`,
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir procedimentos: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}