const db = require('../dataBase/connection');

module.exports = {
    async listarLeito(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de leito obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao leito atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarLeito(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de leito obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar leito: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async editarLeito(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de leito obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar leito: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarLeito(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de leito obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar leito: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}