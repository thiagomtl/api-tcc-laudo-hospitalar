const db = require('../dataBase/connection');

module.exports = {
    async listarUsuario(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de usuário obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar usuário: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarUsuario(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de usuário obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar usuário: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async editarUsuario(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de usuário obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar usuário: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarUsuario(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de usuário obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar usuário: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}