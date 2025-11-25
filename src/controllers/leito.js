const db = require('../dataBase/connection');

module.exports = {
    async listarLeito(request, response) {
        try {

            const sql = `
            SELECT 
                leito_id, set_id, leito_identificacao 
            FROM Leito;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de leito obtida com sucesso',
                    itens: rows.length,
                    dados: rows

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao leito atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarLeito(request, response) {
        try {

            const { setor, leito} = request.body;
            
            const sql =`
            INSERT INTO Leito 
                (set_id, leito_identificacao) 
            VALUES 
                (?,?);
            `;

            const values = [setor, leito];

            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                setor,
                leito
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de leito obtida com sucesso',
                    dados: dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar leito: ${error.message}`,
                    dados: error.message
                }
            );
        }

    },
    async editarLeito(request, response) {
        try {

            const { setor, leito} = request.body;

            const { id } = request.params;

            const sql =`
            UPDATE Leito 
            SET set_id = ?, leito_identificacao = ?
            WHERE leito_id = ?;
            `;

            const values = [setor, leito, id];
            
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json(
                    {
                        sucesso: false,
                        mensagem: `Leito ID ${id} não encontrado para atualização`,
                        dados: null
                    }
                );
            }

            const dados = {
                id,
                setor,
                leito
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização ID ${id} de leito obtida com sucesso`,
                    dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar leito: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarLeito(request, response) {
        try {

            const { id } = request.params;

            const sql = `DELETE FROM Leito WHERE Leito_id = ?`;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Leito ID ${id} não encontrado para exclusão`,
                    dados: null
                });
            }
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão ID ${id} de leito obtida com sucesso`,
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar leito: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}