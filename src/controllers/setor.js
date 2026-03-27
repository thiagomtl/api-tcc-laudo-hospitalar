const db = require('../dataBase/connection');

module.exports = {

    async listarSetor(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { pesquisa } = request.query;
            const setor_listar = pesquisa ? `%${pesquisa}%` : `%`;
            const sql = `
                SELECT set_id, set_nome 
                FROM Setor
                WHERE set_nome LIKE ?;
                `;

            const values = [setor_listar];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de setores obtida com sucesso`,
                    nItens,
                    dados: rows
                }
            );
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao obter lista de setores: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },


    async cadastrarSetor(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { nome } = request.body;
            const sql = `
                INSERT INTO Setor (set_nome)
                VALUES (?);
            `;

            const values = [nome];
            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                nome
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de setor realizado com sucesso`,
                    dados: dados
                }
            );
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar setor: ${error.message}`,
                    dados: error.message
                }
            )
        }
    },


    async editarSetor(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { nome } = request.body;
            const { id } = request.params;
            const sql = `
                UPDATE Setor SET set_nome = ?
                WHERE  Set_id = ?
            `;

            const values = [nome, id];
            const [result] = await db.query(sql, values);


            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Setor ${id} não encontrado!`,
                    dados: null
                });
            }

            const dados = {
                id,
                nome,
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Setor ${id} atualizado com sucesso!`,
                    dados

                }
            )
        } 
        
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar setor: ${error.message} `,
                    dados: error.message
                }
            );
        }

    },


    async apagarSetor(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { id } = request.params;
            const sql = `DELETE FROM Setor where set_id = ?`;
            const values = [id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Setor ${id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Setor ${id} excluído com sucesso`,
                    dados: null

                }
            )
        } 
        
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar setor: ${error.message} `,
                    dados: error.message
                }
            );
        }
    },
}