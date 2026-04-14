const db = require('../dataBase/connection');

module.exports = {
    async listarSetor(request, response) {
        try {
            const { pesquisa } = request.query;
            const setor_listar = pesquisa ? `%${pesquisa}%` : `%`;

            const sql = `
                SELECT set_id, set_nome
                FROM Setor
                WHERE set_nome LIKE ?
                ORDER BY set_id DESC;
            `;

            const values = [setor_listar];
            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de setores obtida com sucesso.',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar setor: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarSetor(request, response) {
        try {
            const { nome } = request.body;

            if (!nome) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O nome do setor é obrigatório.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Setor (set_nome)
                VALUES (?);
            `;

            const values = [nome];
            const [result] = await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de setor realizado com sucesso.',
                dados: {
                    id: result.insertId,
                    nome
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar setor: ${error.message}`,
                dados: null
            });
        }
    },

    async editarSetor(request, response) {
        try {
            const { nome } = request.body;
            const { id } = request.params;

            if (!nome) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O nome do setor é obrigatório.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Setor
                SET set_nome = ?
                WHERE set_id = ?;
            `;

            const values = [nome, id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Setor ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Setor ${id} atualizado com sucesso.`,
                dados: {
                    id,
                    nome
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar setor: ${error.message}`,
                dados: null
            });
        }
    },

    async apagarSetor(request, response) {
        try {
            const { id } = request.params;

            const sql = `DELETE FROM Setor WHERE set_id = ?`;
            const values = [id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Setor ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Setor ${id} excluído com sucesso.`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar setor: ${error.message}`,
                dados: null
            });
        }
    }
};