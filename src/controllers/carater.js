const db = require('../dataBase/connection');

module.exports = {

    async listarCarater(request, response) {
        try {
            const { pesquisa } = request.query;
            const car_listar = pesquisa ? `%${pesquisa}%` : `%`;
            const sql = `
                SELECT car_id, car_tipo 
                FROM Carater
                WHERE car_tipo LIKE?;
            `;

            const values = [car_listar];
            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de carater obtida com sucesso`,
                    nItens,
                    dados: rows
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao obter lista de carater: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },


    async cadastrarCarater(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { tipo } = request.body;
            const sql = `
                INSERT INTO Carater (car_tipo) 
                VALUES (?);
            `;
            
            const values = [ tipo ]
            const [result] = await db.query(sql, values);

            const dados = { 
                id: result.insertId,
                tipo
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de carater realizado com sucesso`,
                    dados: dados
                }
            );
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar carater: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async editarCarater(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { tipo } = request.body;
            const { id } = request.params;
            const sql = `
                UPDATE Carater SET car_tipo = ?
                WHERE car_id = ?
            `;

            const values = [ tipo, id ];
            const [result] = await db.query(sql,values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Carater com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const dados = {
                id,
                tipo
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de carater obtida com sucesso`,
                    dados: dados
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar carater: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async apagarCarater(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { id } = request.params;
            const sql = `DELETE FROM Carater WHERE car_id = ?`;
            const values = [id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Carater com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Carater apagado com sucesso`,
                    dados: null
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar carater: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}