const db = require('../dataBase/connection')

module.exports = {
    
    async listarProcedimentoCid(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: `Lista de procedimentos e cid obtidas com sucesso`,
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar procedimentos e cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async cadastrarProcedimentoCid(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de procedimentos e cid realizados com sucesso`,
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar procedimentos e cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async editarProcedimentoCid(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: `Atualização de procedimentos e cid realizados com sucesso`,
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar procedimentos e cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async apagarProcedimentoCid(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de procedimentos e cid realizados com sucesso`,
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir procedimentos e cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}