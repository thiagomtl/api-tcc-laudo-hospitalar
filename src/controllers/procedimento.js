const db = require('../dataBase/connection');

module.exports = {
    
    async listarProcedimento(request, response) {
        try {
            const sql = `
                SELECT pro_id, pro_codigo, pro_descricao 
                FROM Procedimento;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de procedimentos obtidas com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar procedimentos: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async cadastrarProcedimento(request, response) {
        try {
            const sql = `
                SELECT pro_id, pro_codigo, pro_descricao 
                FROM Procedimento;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de procedimentos realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar procedimentos: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async editarProcedimento(request, response) {
        try {
            const sql = `
                SELECT pro_id, pro_codigo, pro_descricao 
                FROM Procedimento;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de procedimentos realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar procedimentos: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async apagarProcedimento(request, response) {
        try {
            const sql = `
                SELECT pro_id, pro_codigo, pro_descricao 
                FROM Procedimento;
                `;
            const [rows] = await db.query(sql);
            
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de procedimentos realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir procedimentos: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },
}