const db = require('../dataBase/connection');

module.exports = {
    async listarInstituicao(request, response) {
        try {
            const sql = `
                SELECT 
                    inst_id,
                    inst_nome,
                    inst_razao_social,
                    inst_cnes,
                    inst_cnpj
                FROM Instituicao
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de instituições obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar instituições: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarInstituicao(request, response) {
        try {
            const { nome, razao_social, cnes, cnpj } = request.body;

            if (!nome || !razao_social || !cnes || !cnpj) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome, razão social, CNES e CNPJ são obrigatórios.',
                    dados: null
                });
            }

            const [instituicaoExistente] = await db.query(
                `
                SELECT inst_id
                FROM Instituicao
                WHERE inst_cnes = ? OR inst_cnpj = ?
                `,
                [cnes, cnpj]
            );

            if (instituicaoExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe instituição cadastrada com este CNES ou CNPJ.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Instituicao (
                    inst_nome,
                    inst_razao_social,
                    inst_cnes,
                    inst_cnpj
                ) VALUES (?, ?, ?, ?)
            `;

            const values = [nome, razao_social, cnes, cnpj];
            const [result] = await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de instituição realizado com sucesso',
                dados: {
                    id: result.insertId,
                    nome,
                    razao_social,
                    cnes,
                    cnpj
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar instituição: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarInstituicao(request, response) {
        try {
            const { nome, razao_social, cnes, cnpj } = request.body;
            const { id } = request.params;

            if (!nome || !razao_social || !cnes || !cnpj) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome, razão social, CNES e CNPJ são obrigatórios.',
                    dados: null
                });
            }

            const [instituicaoAtual] = await db.query(
                `
                SELECT inst_id
                FROM Instituicao
                WHERE inst_id = ?
                `,
                [id]
            );

            if (instituicaoAtual.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Instituição ${id} não encontrada!`,
                    dados: null
                });
            }

            const [instituicaoDuplicada] = await db.query(
                `
                SELECT inst_id
                FROM Instituicao
                WHERE (inst_cnes = ? OR inst_cnpj = ?)
                  AND inst_id != ?
                `,
                [cnes, cnpj, id]
            );

            if (instituicaoDuplicada.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outra instituição com este CNES ou CNPJ.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Instituicao
                SET
                    inst_nome = ?,
                    inst_razao_social = ?,
                    inst_cnes = ?,
                    inst_cnpj = ?
                WHERE inst_id = ?
            `;

            const values = [nome, razao_social, cnes, cnpj, id];
            await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Instituição ${id} atualizada com sucesso`,
                dados: {
                    id: Number(id),
                    nome,
                    razao_social,
                    cnes,
                    cnpj
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar instituição: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarInstituicao(request, response) {
        try {
            const { id } = request.params;

            const [instituicaoExistente] = await db.query(
                `
                SELECT inst_id
                FROM Instituicao
                WHERE inst_id = ?
                `,
                [id]
            );

            if (instituicaoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Instituição ${id} não encontrada!`,
                    dados: null
                });
            }

            const [usuariosVinculados] = await db.query(
                `
                SELECT usu_id
                FROM Usuario
                WHERE inst_id = ?
                `,
                [id]
            );

            if (usuariosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir a instituição porque existem usuários vinculados a ela.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Instituicao
                WHERE inst_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Instituição ${id} excluída com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar instituição: ${error.message}`,
                dados: error.message
            });
        }
    }
};