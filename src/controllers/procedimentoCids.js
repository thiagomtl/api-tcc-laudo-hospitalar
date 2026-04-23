const db = require('../dataBase/connection');

module.exports = {

    async listarProcedimentoCid(request, response) {
        try {
            const sql = `
                SELECT
                    pc.proc_cid_id,
                    pc.pro_id,
                    p.pro_codigo,
                    p.pro_descricao,
                    pc.cid_id,
                    c.cid_codigo,
                    c.cid_descricao
                FROM Procedimento_Cids pc
                INNER JOIN Procedimento p ON pc.pro_id = p.pro_id
                INNER JOIN CID c ON pc.cid_id = c.cid_id
                ORDER BY pc.proc_cid_id DESC
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de vínculos entre procedimento e CID obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar procedimento e CID: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarProcedimentoCid(request, response) {
        try {
            const { procedimento, cid } = request.body;

            if (!procedimento || !cid) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Procedimento e CID são obrigatórios.',
                    dados: null
                });
            }

            const [procedimentoExistente] = await db.query(
                `
                SELECT pro_id
                FROM Procedimento
                WHERE pro_id = ?
                `,
                [procedimento]
            );

            if (procedimentoExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Procedimento não encontrado.',
                    dados: null
                });
            }

            const [cidExistente] = await db.query(
                `
                SELECT cid_id
                FROM CID
                WHERE cid_id = ?
                `,
                [cid]
            );

            if (cidExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CID não encontrado.',
                    dados: null
                });
            }

            const [vinculoExistente] = await db.query(
                `
                SELECT proc_cid_id
                FROM Procedimento_Cids
                WHERE pro_id = ?
                  AND cid_id = ?
                `,
                [procedimento, cid]
            );

            if (vinculoExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Esse vínculo entre procedimento e CID já existe.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Procedimento_Cids (pro_id, cid_id)
                VALUES (?, ?)
            `;

            const [result] = await db.query(sql, [procedimento, cid]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Vínculo entre procedimento e CID cadastrado com sucesso',
                dados: {
                    id: result.insertId,
                    procedimento,
                    cid
                }
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar procedimento e CID: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarProcedimentoCid(request, response) {
        try {
            const { procedimento, cid } = request.body;
            const { id } = request.params;

            if (!procedimento || !cid) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Procedimento e CID são obrigatórios.',
                    dados: null
                });
            }

            const [vinculoAtual] = await db.query(
                `
                SELECT proc_cid_id
                FROM Procedimento_Cids
                WHERE proc_cid_id = ?
                `,
                [id]
            );

            if (vinculoAtual.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Vínculo procedimento/CID com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const [procedimentoExistente] = await db.query(
                `
                SELECT pro_id
                FROM Procedimento
                WHERE pro_id = ?
                `,
                [procedimento]
            );

            if (procedimentoExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Procedimento não encontrado.',
                    dados: null
                });
            }

            const [cidExistente] = await db.query(
                `
                SELECT cid_id
                FROM CID
                WHERE cid_id = ?
                `,
                [cid]
            );

            if (cidExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CID não encontrado.',
                    dados: null
                });
            }

            const [vinculoDuplicado] = await db.query(
                `
                SELECT proc_cid_id
                FROM Procedimento_Cids
                WHERE pro_id = ?
                  AND cid_id = ?
                  AND proc_cid_id != ?
                `,
                [procedimento, cid, id]
            );

            if (vinculoDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outro vínculo com esse procedimento e CID.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Procedimento_Cids
                SET pro_id = ?, cid_id = ?
                WHERE proc_cid_id = ?
            `;

            await db.query(sql, [procedimento, cid, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Vínculo entre procedimento e CID atualizado com sucesso',
                dados: {
                    id: Number(id),
                    procedimento,
                    cid
                }
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar procedimento e CID: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarProcedimentoCid(request, response) {
        try {
            const { id } = request.params;

            const [vinculoExistente] = await db.query(
                `
                SELECT proc_cid_id
                FROM Procedimento_Cids
                WHERE proc_cid_id = ?
                `,
                [id]
            );

            if (vinculoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Vínculo procedimento/CID com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const [laudosVinculados] = await db.query(
                `
                SELECT lau_id
                FROM Laudo
                WHERE proc_cid_id = ?
                `,
                [id]
            );

            if (laudosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o vínculo porque existem laudos vinculados a ele.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Procedimento_Cids
                WHERE proc_cid_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Vínculo entre procedimento e CID excluído com sucesso',
                dados: null
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao excluir procedimento e CID: ${error.message}`,
                dados: error.message
            });
        }
    }
};