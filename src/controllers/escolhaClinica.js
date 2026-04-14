const db = require('../dataBase/connection');

module.exports = {
    async listarEscolhaClinica(request, response) {
        try {
            const { pesquisa } = request.query;
            const escolha_listar = pesquisa ? `%${pesquisa}%` : `%`;

            const sql = `
                SELECT cli_id, cli_descricao
                FROM Escolha_Clinica
                WHERE cli_descricao LIKE ?
                ORDER BY cli_id DESC;
            `;

            const values = [escolha_listar];
            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de escolha clínica obtida com sucesso.',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar escolha clínica: ${error.message}`,
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

            const sql = `
                INSERT INTO Escolha_Clinica (cli_descricao)
                VALUES (?);
            `;

            const values = [descricao];
            const [result] = await db.query(sql, values);

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
                dados: null
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

            const sql = `
                UPDATE Escolha_Clinica
                SET cli_descricao = ?
                WHERE cli_id = ?;
            `;

            const values = [descricao, id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Escolha clínica com ID ${id} não encontrada.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Escolha clínica atualizada com sucesso.',
                dados: {
                    id,
                    descricao
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar escolha clínica: ${error.message}`,
                dados: null
            });
        }
    },

    async apagarEscolhaClinica(request, response) {
        try {
            const { id } = request.params;

            const sql = `DELETE FROM Escolha_Clinica WHERE cli_id = ?`;
            const values = [id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Escolha clínica com ID ${id} não encontrada.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Escolha clínica excluída com sucesso.',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao excluir escolha clínica: ${error.message}`,
                dados: null
            });
        }
    }
};