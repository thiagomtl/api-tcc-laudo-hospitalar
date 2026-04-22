const db = require('../dataBase/connection');

module.exports = {
    async listarSetor(request, response) {
        try {
            const sql = `
                SELECT
                    set_id,
                    set_nome
                FROM Setor
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de setores obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar setores: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarSetor(request, response) {
        try {
            const { setor } = request.body;

            if (!setor) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O nome do setor é obrigatório.',
                    dados: null
                });
            }

            const [setorExistente] = await db.query(
                `
                SELECT set_id
                FROM Setor
                WHERE set_nome = ?
                `,
                [setor]
            );

            if (setorExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe setor cadastrado com esse nome.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Setor (set_nome)
                VALUES (?)
            `;

            const [result] = await db.query(sql, [setor]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Setor cadastrado com sucesso',
                dados: {
                    id: result.insertId,
                    setor
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar setor: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarSetor(request, response) {
        try {
            const { setor } = request.body;
            const { id } = request.params;

            if (!setor) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O nome do setor é obrigatório.',
                    dados: null
                });
            }

            const [setorAtual] = await db.query(
                `
                SELECT set_id
                FROM Setor
                WHERE set_id = ?
                `,
                [id]
            );

            if (setorAtual.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Setor ID ${id} não encontrado para atualização.`,
                    dados: null
                });
            }

            const [setorDuplicado] = await db.query(
                `
                SELECT set_id
                FROM Setor
                WHERE set_nome = ?
                  AND set_id != ?
                `,
                [setor, id]
            );

            if (setorDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outro setor com esse nome.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Setor
                SET set_nome = ?
                WHERE set_id = ?
            `;

            await db.query(sql, [setor, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Setor ID ${id} atualizado com sucesso`,
                dados: {
                    id: Number(id),
                    setor
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar setor: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarSetor(request, response) {
        try {
            const { id } = request.params;

            const [setorExistente] = await db.query(
                `
                SELECT set_id
                FROM Setor
                WHERE set_id = ?
                `,
                [id]
            );

            if (setorExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Setor ID ${id} não encontrado para exclusão.`,
                    dados: null
                });
            }

            const [leitosVinculados] = await db.query(
                `
                SELECT leito_id
                FROM Leito
                WHERE set_id = ?
                `,
                [id]
            );

            if (leitosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o setor porque existem leitos vinculados a ele.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Setor
                WHERE set_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Setor ID ${id} excluído com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar setor: ${error.message}`,
                dados: error.message
            });
        }
    }
};