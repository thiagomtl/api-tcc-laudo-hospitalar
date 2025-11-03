const db = require('../dataBase/connection')

module.exports = {
    
    async listarEscolhaClinica(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Lista de escolha clínicas obtidas cosm sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao listar escolha clínica: ${error.message}',
                    dados: null
                }
            )
        }
    },

    async  cadastrarEscolhaClinica(request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de escolha clínica realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao cadastrar escolha clínica: ${error.message}',
                    dados: null
                }
            )
        }
    },

    async editarEscolhaClinica (request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de escolha clínica realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao atualizar escolha clínica: ${error.message}',
                    dados: null
                }
            )
        }
    },

    async apagarEscolhaClinica (request, response) {
        try {
            return response.status(200), json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de escolha clínica realizado com sucesso',
                    dados: null
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao excluir escolha clínica: ${error.message}',
                    dados: null
                }
            )
        }
    },
}