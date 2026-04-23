const db = require('../dataBase/connection');

module.exports = {
    async listarEscolhaClinica(request, response) {
        try {
            const { pesquisa } = request.query;
            const escolhaListar = pesquisa ? `%${pesquisa}%` : `%`;

            const sql = `
                SELECT
                    cli_id,
                    cli_descricao
                FROM Escolha_Clinica
                WHERE cli_descricao LIKE ?
                ORDER BY cli_id DESC
            `;

            const [rows] = await db.query(sql, [escolhaListar]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de escolhas clínicas obtida com sucesso.',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar escolhas clínicas: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarEscolhaClinica(request, response) {
        try {
            const { descricao } = request.body;

            if (!descricao) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'A descrição da escolha clínica é obrigatória.',
                    dados: null
                });
            }

            const [descricaoExistente] = await db.query(
                `
                SELECT cli_id
                FROM Escolha_Clinica
                WHERE cli_descricao = ?
                `,
                [descricao]
            );

            if (descricaoExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe escolha clínica cadastrada com essa descrição.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Escolha_Clinica (cli_descricao)
                VALUES (?)
            `;

            const [result] = await db.query(sql, [descricao]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de escolha clínica realizado com sucesso.',
                dados: {
                    id: result.insertId,
                    descricao
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar escolha clínica: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarEscolhaClinica(request, response) {
        try {
            const { descricao } = request.body;
            const { id } = request.params;

            if (!descricao) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'A descrição da escolha clínica é obrigatória.',
                    dados: null
                });
            }

            const [escolhaExistente] = await db.query(
                `
                SELECT cli_id
                FROM Escolha_Clinica
                WHERE cli_id = ?
                `,
                [id]
            );

            if (escolhaExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Escolha clínica com ID ${id} não encontrada.`,
                    dados: null
                });
            }

            const [descricaoDuplicada] = await db.query(
                `
                SELECT cli_id
                FROM Escolha_Clinica
                WHERE cli_descricao = ?
                  AND cli_id != ?
                `,
                [descricao, id]
            );

            if (descricaoDuplicada.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outra escolha clínica com essa descrição.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Escolha_Clinica
                SET cli_descricao = ?
                WHERE cli_id = ?
            `;

            await db.query(sql, [descricao, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Escolha clínica atualizada com sucesso.',
                dados: {
                    id: Number(id),
                    descricao
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar escolha clínica: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarEscolhaClinica(request, response) {
        try {
            const { id } = request.params;

            const [escolhaExistente] = await db.query(
                `
                SELECT cli_id
                FROM Escolha_Clinica
                WHERE cli_id = ?
                `,
                [id]
            );

            if (escolhaExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Escolha clínica com ID ${id} não encontrada.`,
                    dados: null
                });
            }

            const [laudosVinculados] = await db.query(
                `
                SELECT lau_id
                FROM Laudo
                WHERE cli_id = ?
                `,
                [id]
            );

            if (laudosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir a escolha clínica porque existem laudos vinculados a ela.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Escolha_Clinica
                WHERE cli_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Escolha clínica excluída com sucesso.',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao excluir escolha clínica: ${error.message}`,
                dados: error.message
            });
        }
    }
};