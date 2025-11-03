const db = require('../dataBase/connection')

module.exports = {
    
    async listarProcedimentoCid(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Lista de procedimento e cids obtidas cosm sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao listar procedimento e cid: ${error.message}',
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
                    mensagem: 'Cadastro de procedimento e cids realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao cadastrar procedimento e cids: ${error.message}',
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
                    mensagem: 'Atualização de procedimento e cids realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao atualizar procedimento e cids: ${error.message}',
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
                    mensagem: 'Exclusão de procedimento e cids realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao excluir procedimento e cids: ${error.message}',
                    dados: null
                }
            )
        }
    },
}