const db = require('../dataBase/connection');

module.exports = {

    async listarProcedimento(request, response) {
        try {
            const { pesquisa } = request.query;
            const filtro = pesquisa ? `%${pesquisa}%` : `%`;

            const sql = `
                SELECT
                    pro_id,
                    pro_codigo,
                    pro_descricao
                FROM Procedimento
                WHERE pro_codigo LIKE ? OR pro_descricao LIKE ?
                ORDER BY pro_id DESC
            `;

            const [rows] = await db.query(sql, [filtro, filtro]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de procedimentos obtida com sucesso',
                itens: rows.length,
                dados: rows
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar procedimento: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarProcedimento(request, response) {
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
                SELECT pro_id
                FROM Procedimento
                WHERE pro_codigo = ?
                `,
                [codigo]
            );

            if (codigoExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe procedimento com esse código.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Procedimento (pro_codigo, pro_descricao)
                VALUES (?, ?)
            `;

            const [result] = await db.query(sql, [codigo, descricao]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Procedimento cadastrado com sucesso',
                dados: {
                    id: result.insertId,
                    codigo,
                    descricao
                }
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar procedimento: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarProcedimento(request, response) {
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

            const [procedimentoAtual] = await db.query(
                `
                SELECT pro_id
                FROM Procedimento
                WHERE pro_id = ?
                `,
                [id]
            );

            if (procedimentoAtual.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Procedimento ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const [codigoDuplicado] = await db.query(
                `
                SELECT pro_id
                FROM Procedimento
                WHERE pro_codigo = ?
                  AND pro_id != ?
                `,
                [codigo, id]
            );

            if (codigoDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outro procedimento com esse código.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Procedimento
                SET pro_codigo = ?, pro_descricao = ?
                WHERE pro_id = ?
            `;

            await db.query(sql, [codigo, descricao, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Procedimento ID ${id} atualizado com sucesso`,
                dados: {
                    id: Number(id),
                    codigo,
                    descricao
                }
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar procedimento: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarProcedimento(request, response) {
        try {
            const { id } = request.params;

            const [procedimentoExistente] = await db.query(
                `
                SELECT pro_id
                FROM Procedimento
                WHERE pro_id = ?
                `,
                [id]
            );

            if (procedimentoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Procedimento ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const [vinculo] = await db.query(
                `
                SELECT pro_id
                FROM Procedimento_Cids
                WHERE pro_id = ?
                `,
                [id]
            );

            if (vinculo.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o procedimento pois ele está vinculado a CIDs.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Procedimento
                WHERE pro_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Procedimento ID ${id} excluído com sucesso`,
                dados: null
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao excluir procedimento: ${error.message}`,
                dados: error.message
            });
        }
    }
};