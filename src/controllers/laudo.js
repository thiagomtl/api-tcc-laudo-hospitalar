const db = require('../dataBase/connection');

module.exports = {

    async listarLaudo(request, response) {
        try {
            const sql = `
                SELECT lau_id, atend_id, cli_id, proc_cid_id, lau_sinais, lau_internacao, lau_resultado, lau_recurso, lau_datapreenc, lau_status = 1 AS lau_status
                FROM Laudo;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de laudos obtidas com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar laudos: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async cadastrarLaudo(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de laudos realizados com sucesso`,
                    dados: null
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar laudos: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async editarLaudo(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de laudos realizados com sucesso`,
                    dados: null
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar laudos: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async apagarLaudo(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de laudo realizados com sucesso`,
                    dados: null
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir laudos: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}