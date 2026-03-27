const db = require('../dataBase/connection');

module.exports = {

    async listarProcedimento(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); 
            const { pesquisa } = request.query;
            const proc_listar = pesquisa ? `%${pesquisa}%` : `%`;
            const sql = `
                SELECT pro_id, pro_codigo, pro_descricao 
                FROM Procedimento
                WHERE pro_codigo LIKE ? OR pro_descricao LIKE?;
                `;
            
            const values = [proc_listar, proc_listar];
            
            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de procedimento obtida com sucesso`,
                    nItens,
                    dados: rows
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar procedimento: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async cadastrarProcedimento(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); 
            const { codigo, descricao } = request.body;

            const sql = `
                INSERT INTO Procedimento (pro_codigo, pro_descricao) 
                VALUES (?, ?);
            `;

            const values = [ codigo, descricao ];
            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                codigo,
                descricao
            };
       
            
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de procedimento realizado com sucesso`,
                    dados: dados
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar procedimento: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async editarProcedimento(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); 
            const { codigo, descricao } = request.body;
            const { id } = request.params;

            const sql = `
                UPDATE Procedimento SET pro_codigo = ?, pro_descricao = ?
                WHERE pro_id = ?
            `;

            const values = [ codigo, descricao, id ];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Procedimento com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const dados = {
                id,
                codigo,
                descricao
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de procedimento realizado com sucesso`,
                    dados: dados
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar procedimento: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async apagarProcedimento(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); 
            const { id } = request.params;
            const sql = `DELETE FROM Procedimento WHERE pro_id = ?`;
            const values = [ id ];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Procedimento com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de procedimento realizado com sucesso`,
                    dados: null
                }
            )
        }
        
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir procedimento: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}