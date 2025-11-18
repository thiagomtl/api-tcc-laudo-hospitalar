const db = require('../dataBase/connection');

module.exports = {
    
    async listarProcedimentoCid(request, response) {
        try {
            const sql = `
                SELECT proc_cid_id, pro_id, cid_id 
                FROM Procedimento_Cids;
                `;
            const [rows] = await db.query(sql);
            
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de procedimentos e cid obtidas com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar procedimentos e cid: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async cadastrarProcedimentoCid(request, response) {
        try {
            const sql = `
                SELECT proc_cid_id, pro_id, cid_id 
                FROM Procedimento_Cids;
                `;
            const [rows] = await db.query(sql);
            
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de procedimentos e cid realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar procedimentos e cid: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async editarProcedimentoCid(request, response) {
        try {
            const sql = `
                SELECT proc_cid_id, pro_id, cid_id 
                FROM Procedimento_Cids;
                `;
            const [rows] = await db.query(sql);
            
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de procedimentos e cid realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar procedimentos e cid: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async apagarProcedimentoCid(request, response) {
        try {
            const sql = `
                SELECT proc_cid_id, pro_id, cid_id 
                FROM Procedimento_Cids;
                `;
            const [rows] = await db.query(sql);
            
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de procedimentos e cid realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir procedimentos e cid: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },
}