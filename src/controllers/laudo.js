const db = require('../dataBase/connection')

module.exports = {
    
    async listarLaudo(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Lista de laudo obtida cosm sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao listar laudo: ${error.message}',
                    dados: null
                }
            )
        }
    },

    async cadastrarLaudo(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de laudo realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao cadastrar laudo: ${error.message}',
                    dados: null
                }
            )
        }
    },

    async editarLaudo(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de laudo realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao atualizar laudo: ${error.message}',
                    dados: null
                }
            )
        }
    },

    async apagarLaudo(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de laudo realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao excluir laudo: ${error.message}',
                    dados: null
                }
            )
        }
    },
}