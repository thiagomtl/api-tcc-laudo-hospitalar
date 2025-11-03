const db = require('../database/connection');

module.exports = {
    async listarFavorito(request, response) {
        try {
            return response.status(200).jason(
                {
                    sucesso: true,
                    mensagem: 'Lista de favorito obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).jason(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar favorito: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarFavorito(request, response) {
        try {
            return response.status(200).jason(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de favorito obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).jason(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar favorito: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async editarFavorito(request, response) {
        try {
            return response.status(200).jason(
                {
                    sucesso: true,
                    mensagem: 'Atualização de favorito obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).jason(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar favorito: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarFavorito(request, response) {
        try {
            return response.status(200).jason(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de favorito obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).jason(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar favorito: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}