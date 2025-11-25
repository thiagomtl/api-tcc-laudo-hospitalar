const db = require('../dataBase/connection');

module.exports = {

    async listarProcedimento(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); // <-- coloque aqui
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
                    dados: null
                }
            )
        }
    },

    async cadastrarProcedimento(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); // <-- coloque aqui
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
                    mensagem: `Cadastro de procedimentos realizados com sucesso`,
                    dados: dados
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar procedimentos: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async editarProcedimento(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); // <-- coloque aqui
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
                    mensagem: `Atualização de procedimentos realizada com sucesso`,
                    dados: dados
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar procedimentos: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async apagarProcedimento(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); // <-- coloque aqui
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
                    mensagem: `Exclusão de procedimentos realizados com sucesso`,
                    dados: null
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir procedimentos: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}