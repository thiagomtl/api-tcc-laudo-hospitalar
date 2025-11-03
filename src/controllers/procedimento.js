const db = require('../dataBase/connection')

module.exports = {
    
    async listarProcedimento(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Lista de procedimentos obtidas cosm sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao listar procedimento: ${error.message}',
                    dados: null
                }
            )
        }
    },

    async cadastrarProcedimento(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de procedimento realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao cadastrar procedimento: ${error.message}',
                    dados: null
                }
            )
        }
    },

    async editarProcedimento(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de procedimento realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao atualizar procedimento: ${error.message}',
                    dados: null
                }
            )
        }
    },

    async apagarProcedimento(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de procedimento realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao excluir procedimento: ${error.message}',
                    dados: null
                }
            )
        }
    },
}