const db = require('../dataBase/connection');

module.exports = {

    async listarEscolhaClinica(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); // <-- coloque aqui
            const sql = `
                SELECT cli_id, cli_descricao 
                FROM Escolha_Clinica;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de escolhas clínicas obtidas com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar escolha clínica: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async cadastrarEscolhaClinica(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); // <-- coloque aqui
            const { descricao } = request.body;

            const sql = `
                INSERT INTO Escolha_Clinica (cli_descricao) 
                VALUES (?);
            `;

            const values = [ descricao ];
            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                descricao
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de escolha clínica realizados com sucesso`,
                    dados: null
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar escolha clínica: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async editarEscolhaClinica(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); // <-- coloque aqui
            const { descricao } = request.body;
            const { id } = request.params;

            const sql = `
                UPDATE Escolha_Clinica SET cli_descricao = ?
                WHERE cli_id = ?
            `;

            const values = [ descricao, id ];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Escolha Clínica com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const dados = {
                id,
                descricao
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de escolha clínica realizados com sucesso`,
                    dados: dados
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar escolha clínica: ${error.message}`,
                    dados: null
                }
            )
        }
    },

    async apagarEscolhaClinica(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); // <-- coloque aqui
            const { id } = request.params;
            const sql = `DELETE FROM Escolha_CLinica WHERE cli_id = ?`;
            const values = [ id ];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Escolha Clínica com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de escolha clínica realizados com sucesso`,
                    dados: null
                }
            )
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir escolha clínica: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}