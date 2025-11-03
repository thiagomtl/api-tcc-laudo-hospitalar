const db = require('..database/connection');


nodule.exports = {
    async listarPaciente (request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de pacientes obtida com sucesso',
                    dados: null
                }
            );

        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao obter lista de pacientes: $ {error.message}',
                    dados: null
                }
            );


        }
    },
    async editarPaciente (request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de pacientes obtida com sucesso',
                    dados: null
                }
            );

        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao atualizar pacientes: $ {error.message}',
                    dados: null
                }
            );


        }
    },
    async apagarPaciente (request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de pacientes apagada com sucesso',
                    dados: null
                }
            );

        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: 'Erro ao apagar lista de pacientes: $ {error.message}',
                    dados: null
                }
            );

        }
    },
}