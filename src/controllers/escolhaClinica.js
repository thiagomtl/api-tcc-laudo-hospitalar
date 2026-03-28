const db = require('../dataBase/connection');

module.exports = {

    async listarEscolhaClinica(request, response) {
        try {
            const { pesquisa } = request.query;
            const escolha_listar = pesquisa ? `%${pesquisa}%` : `%`;
            const sql = `
                SELECT cli_id, cli_descricao 
                FROM Escolha_Clinica
                WHERE cli_descricao LIKE ?;
                `;
            
            const values = [escolha_listar];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de escolha clínica obtida com sucesso`,
                    nItens,
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
            console.log("BODY RECEBIDO:", request.body); 
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
            console.log("BODY RECEBIDO:", request.body); 
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
                    mensagem: `Atualização de escolha clínica realizado com sucesso`,
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
            console.log("BODY RECEBIDO:", request.body); 
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
                    mensagem: `Exclusão de escolha clínica realizado com sucesso`,
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