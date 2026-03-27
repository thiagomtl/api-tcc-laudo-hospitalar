const db = require('../dataBase/connection');

module.exports = {

    async listarCid(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { nome } = request.query;
            const cid_nome = nome ? `%${nome}%` : `%`;
            const sql = `
                SELECT cid_id, cid_codigo, cid_descricao 
                FROM CID
                WHERE cid_descricao LIKE ?;
                `;


            const values = [cid_nome];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de cid obtida com sucesso`,
                    nItens,
                    dados: rows
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async cadastrarCid(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { codigo, descricao } = request.body;

            const sql = `
                INSERT INTO CID (cid_codigo, cid_descricao) 
                VALUES (?, ?);
            `;

            const values = [codigo, descricao];
            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                codigo,
                descricao
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de cid realizado com sucesso`,
                    dados: dados
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async editarCid(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { codigo, descricao } = request.body;
            const { id } = request.params;

            const sql = `
                UPDATE CID SET cid_codigo = ?, cid_descricao = ?
                WHERE cid_id = ?
            `;

            const values = [codigo, descricao, id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `CID com ID ${id} não encontrado.`,
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
                    mensagem: `Atualização de cid realizado com sucesso`,
                    dados: dados
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async apagarCid(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { id } = request.params;
            const sql = `DELETE FROM CID WHERE cid_id = ?`;
            const values = [ id ];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `CID com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de cid realizado com sucesso`,
                    dados: null
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir cid: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}