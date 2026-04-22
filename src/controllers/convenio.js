const db = require('../dataBase/connection');

module.exports = {
    async listarConvenio(request, response) {
        try {
            const sql = `
                SELECT
                    con_id,
                    con_tipo
                FROM Convenio
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de convênios obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar convênios: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarConvenio(request, response) {
        try {
            const { convenio } = request.body;

            if (!convenio) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O tipo de convênio é obrigatório.',
                    dados: null
                });
            }

            const [convenioExistente] = await db.query(
                `
                SELECT con_id
                FROM Convenio
                WHERE con_tipo = ?
                `,
                [convenio]
            );

            if (convenioExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe convênio cadastrado com esse nome.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Convenio (con_tipo)
                VALUES (?)
            `;

            const [result] = await db.query(sql, [convenio]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Convênio cadastrado com sucesso',
                dados: {
                    id: result.insertId,
                    convenio
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar convênio: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarConvenio(request, response) {
        try {
            const { convenio } = request.body;
            const { id } = request.params;

            if (!convenio) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O tipo de convênio é obrigatório.',
                    dados: null
                });
            }

            const [convenioAtual] = await db.query(
                `
                SELECT con_id
                FROM Convenio
                WHERE con_id = ?
                `,
                [id]
            );

            if (convenioAtual.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Convênio ID ${id} não encontrado para atualização.`,
                    dados: null
                });
            }

            const [convenioDuplicado] = await db.query(
                `
                SELECT con_id
                FROM Convenio
                WHERE con_tipo = ?
                  AND con_id != ?
                `,
                [convenio, id]
            );

            if (convenioDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outro convênio com esse nome.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Convenio
                SET con_tipo = ?
                WHERE con_id = ?
            `;

            await db.query(sql, [convenio, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Convênio ID ${id} atualizado com sucesso`,
                dados: {
                    id: Number(id),
                    convenio
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar convênio: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarConvenio(request, response) {
        try {
            const { id } = request.params;

            const [convenioExistente] = await db.query(
                `
                SELECT con_id
                FROM Convenio
                WHERE con_id = ?
                `,
                [id]
            );

            if (convenioExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Convênio ID ${id} não encontrado para exclusão.`,
                    dados: null
                });
            }

            const [atendimentosVinculados] = await db.query(
                `
                SELECT atend_id
                FROM Atendimento
                WHERE con_id = ?
                `,
                [id]
            );

            if (atendimentosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o convênio porque existem atendimentos vinculados a ele.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Convenio
                WHERE con_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Convênio ID ${id} excluído com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar convênio: ${error.message}`,
                dados: error.message
            });
        }
    }
};