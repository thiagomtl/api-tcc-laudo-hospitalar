const db = require('../dataBase/connection');

module.exports = {
    
    async listarCid(request, response) {
        try {
            const sql = `
                SELECT cid_id, cid_codigo, cid_descricao 
                FROM CID;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de cid obtidas com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar cid: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async cadastrarCid(request, response) {
        try {
            const sql = `
                SELECT cid_id, cid_codigo, cid_descricao 
                FROM CID;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de cid realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar cid: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async editarCid(request, response) {
        try {
            const sql = `
                SELECT cid_id, cid_codigo, cid_descricao 
                FROM CID;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de cid realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar cid: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async apagarCid(request, response) {
        try {
            const sql = `
                SELECT cid_id, cid_codigo, cid_descricao 
                FROM CID;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de cid realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir cid: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },
}