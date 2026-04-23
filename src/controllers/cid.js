const db = require('../dataBase/connection');

module.exports = {

    async listarCid(request, response) {
        try {
            const { pesquisa } = request.query;
            const filtro = pesquisa ? `%${pesquisa}%` : `%`;

            const sql = `
                SELECT
                    cid_id,
                    cid_codigo,
                    cid_descricao
                FROM CID
                WHERE cid_descricao LIKE ? OR cid_codigo LIKE ?
                ORDER BY cid_id DESC
            `;

            const [rows] = await db.query(sql, [filtro, filtro]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de CIDs obtida com sucesso',
                itens: rows.length,
                dados: rows
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar CID: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarCid(request, response) {
        try {
            const { codigo, descricao } = request.body;

            if (!codigo || !descricao) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Código e descrição são obrigatórios.',
                    dados: null
                });
            }

            const [codigoExistente] = await db.query(
                `
                SELECT cid_id
                FROM CID
                WHERE cid_codigo = ?
                `,
                [codigo]
            );

            if (codigoExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe CID com esse código.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO CID (cid_codigo, cid_descricao)
                VALUES (?, ?)
            `;

            const [result] = await db.query(sql, [codigo, descricao]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'CID cadastrado com sucesso',
                dados: {
                    id: result.insertId,
                    codigo,
                    descricao
                }
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar CID: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarCid(request, response) {
        try {
            const { codigo, descricao } = request.body;
            const { id } = request.params;

            if (!codigo || !descricao) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Código e descrição são obrigatórios.',
                    dados: null
                });
            }

            const [cidAtual] = await db.query(
                `
                SELECT cid_id
                FROM CID
                WHERE cid_id = ?
                `,
                [id]
            );

            if (cidAtual.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `CID com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const [codigoDuplicado] = await db.query(
                `
                SELECT cid_id
                FROM CID
                WHERE cid_codigo = ?
                  AND cid_id != ?
                `,
                [codigo, id]
            );

            if (codigoDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outro CID com esse código.',
                    dados: null
                });
            }

            const sql = `
                UPDATE CID
                SET cid_codigo = ?, cid_descricao = ?
                WHERE cid_id = ?
            `;

            await db.query(sql, [codigo, descricao, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `CID com ID ${id} atualizado com sucesso`,
                dados: {
                    id: Number(id),
                    codigo,
                    descricao
                }
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar CID: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarCid(request, response) {
        try {
            const { id } = request.params;

            const [cidExistente] = await db.query(
                `
                SELECT cid_id
                FROM CID
                WHERE cid_id = ?
                `,
                [id]
            );

            if (cidExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `CID com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const [vinculo] = await db.query(
                `
                SELECT cid_id
                FROM Procedimento_Cids
                WHERE cid_id = ?
                `,
                [id]
            );

            if (vinculo.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o CID pois ele está vinculado a procedimentos.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM CID
                WHERE cid_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `CID com ID ${id} excluído com sucesso`,
                dados: null
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao excluir CID: ${error.message}`,
                dados: error.message
            });
        }
    }
};