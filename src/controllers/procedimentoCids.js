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
                    mensagem: `Lista de procedimento e cid obtida com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar procedimento e cid: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },


    async cadastrarProcedimentoCid(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de procedimento e cid realizado com sucesso`,
                    dados: null
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar procedimento e cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async editarProcedimentoCid(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de procedimento e cid realizado com sucesso`,
                    dados: null
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar procedimento e cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async apagarProcedimentoCid(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); 
            const { id } = request.params;
            const sql = `DELETE FROM Procedimento_Cids WHERE proc_cid_id = ?`;
            const values = [ id ];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Procedimento/Cid com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de procedimento e cid realizado com sucesso`,
                    dados: null
                }
            )
        }
        
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir procedimento e cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}