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
                    dados: null
                }
            )
        }
    },

    async cadastrarCid(request, response) {
        try {
            const { codigo, descricao } = request.body;

            const sql = `
                INSERT INTO CID (cid_codigo, cid_descricao) 
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
                    mensagem: `Cadastro de cid realizados com sucesso`,
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
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de cid realizados com sucesso`,
                    dados: null
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
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de cid realizados com sucesso`,
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