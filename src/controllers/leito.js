const db = require('../dataBase/connection');

module.exports = {
    async listarLeito(request, response) {
        try {
            const sql = `
                SELECT
                    l.leito_id,
                    l.set_id,
                    s.set_nome,
                    l.leito_identificacao
                FROM Leito l
                INNER JOIN Setor s ON l.set_id = s.set_id
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de leitos obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar leitos: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarLeito(request, response) {
        try {
            const { setor, identificacao } = request.body;

            if (!setor || !identificacao) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Setor e identificação do leito são obrigatórios.',
                    dados: null
                });
            }

            const [setorExistente] = await db.query(
                `
                SELECT set_id
                FROM Setor
                WHERE set_id = ?
                `,
                [setor]
            );

            if (setorExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Setor não encontrado.',
                    dados: null
                });
            }

            const [leitoDuplicado] = await db.query(
                `
                SELECT leito_id
                FROM Leito
                WHERE set_id = ?
                  AND leito_identificacao = ?
                `,
                [setor, identificacao]
            );

            if (leitoDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe um leito com essa identificação nesse setor.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Leito (
                    set_id,
                    leito_identificacao
                ) VALUES (?, ?)
            `;

            const [result] = await db.query(sql, [setor, identificacao]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Leito cadastrado com sucesso',
                dados: {
                    id: result.insertId,
                    setor,
                    identificacao
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar leito: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarLeito(request, response) {
        try {
            const { setor, identificacao } = request.body;
            const { id } = request.params;

            if (!setor || !identificacao) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Setor e identificação do leito são obrigatórios.',
                    dados: null
                });
            }

            const [leitoExistente] = await db.query(
                `
                SELECT leito_id
                FROM Leito
                WHERE leito_id = ?
                `,
                [id]
            );

            if (leitoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Leito ID ${id} não encontrado para atualização.`,
                    dados: null
                });
            }

            const [setorExistente] = await db.query(
                `
                SELECT set_id
                FROM Setor
                WHERE set_id = ?
                `,
                [setor]
            );

            if (setorExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Setor não encontrado.',
                    dados: null
                });
            }

            const [leitoDuplicado] = await db.query(
                `
                SELECT leito_id
                FROM Leito
                WHERE set_id = ?
                  AND leito_identificacao = ?
                  AND leito_id != ?
                `,
                [setor, identificacao, id]
            );

            if (leitoDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outro leito com essa identificação nesse setor.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Leito
                SET
                    set_id = ?,
                    leito_identificacao = ?
                WHERE leito_id = ?
            `;

            await db.query(sql, [setor, identificacao, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Leito ID ${id} atualizado com sucesso`,
                dados: {
                    id: Number(id),
                    setor,
                    identificacao
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar leito: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarLeito(request, response) {
        try {
            const { id } = request.params;

            const [leitoExistente] = await db.query(
                `
                SELECT leito_id
                FROM Leito
                WHERE leito_id = ?
                `,
                [id]
            );

            if (leitoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Leito ID ${id} não encontrado para exclusão.`,
                    dados: null
                });
            }

            const [atendimentosVinculados] = await db.query(
                `
                SELECT atend_id
                FROM Atendimento
                WHERE leito_id = ?
                `,
                [id]
            );

            if (atendimentosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o leito porque existem atendimentos vinculados a ele.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Leito
                WHERE leito_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Leito ID ${id} excluído com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar leito: ${error.message}`,
                dados: error.message
            });
        }
    }
};