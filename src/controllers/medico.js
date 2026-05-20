const db = require('../dataBase/connection');

module.exports = {
    async listarMedico(request, response) {
        try {
            const sql = `
                SELECT
                    m.med_id,
                    m.usu_id,
                    u.usu_nome AS med_nome,
                    u.usu_documento AS med_cpf,
                    m.med_crm
                FROM Medico m
                INNER JOIN Usuario u ON u.usu_id = m.usu_id
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de medicos obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar medicos: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarMedico(request, response) {
        try {
            const { usu_id, crm } = request.body;

            if (!usu_id || !crm) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuario e CRM sao obrigatorios.',
                    dados: null
                });
            }

            const [usuarioExistente] = await db.query(
                `
                SELECT usu_id
                FROM Usuario
                WHERE usu_id = ?
                  AND usu_tipo IN ('Médico', 'Medico')
                  AND usu_status = 1
                `,
                [usu_id]
            );

            if (usuarioExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuario medico nao encontrado.',
                    dados: null
                });
            }

            const [usuarioVinculado] = await db.query(
                `
                SELECT med_id
                FROM Medico
                WHERE usu_id = ?
                `,
                [usu_id]
            );

            if (usuarioVinculado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Este usuario ja esta vinculado a um medico.',
                    dados: null
                });
            }

            const [crmExistente] = await db.query(
                `
                SELECT med_id
                FROM Medico
                WHERE med_crm = ?
                `,
                [crm]
            );

            if (crmExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM ja cadastrado.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Medico (usu_id, med_crm)
                VALUES (?, ?)
            `;

            const [result] = await db.query(sql, [usu_id, crm]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de medico realizado com sucesso',
                dados: {
                    id: result.insertId,
                    usu_id: Number(usu_id),
                    crm
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar medico: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarMedico(request, response) {
        try {
            const { usu_id, crm } = request.body;
            const { id } = request.params;

            if (!crm) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM e obrigatorio.',
                    dados: null
                });
            }

            const [medicoExistente] = await db.query(
                `
                SELECT med_id, usu_id
                FROM Medico
                WHERE med_id = ?
                `,
                [id]
            );

            if (medicoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Medico ${id} nao encontrado!`,
                    dados: null
                });
            }

            if (usu_id) {
                const [usuarioExistente] = await db.query(
                    `
                    SELECT usu_id
                    FROM Usuario
                    WHERE usu_id = ?
                      AND usu_tipo IN ('Médico', 'Medico')
                      AND usu_status = 1
                    `,
                    [usu_id]
                );

                if (usuarioExistente.length === 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Usuario medico nao encontrado.',
                        dados: null
                    });
                }

                const [usuarioVinculado] = await db.query(
                    `
                    SELECT med_id
                    FROM Medico
                    WHERE usu_id = ?
                      AND med_id != ?
                    `,
                    [usu_id, id]
                );

                if (usuarioVinculado.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Este usuario ja esta vinculado a outro medico.',
                        dados: null
                    });
                }
            }

            const [crmDuplicado] = await db.query(
                `
                SELECT med_id
                FROM Medico
                WHERE med_crm = ?
                  AND med_id != ?
                `,
                [crm, id]
            );

            if (crmDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Ja existe outro medico com este CRM.',
                    dados: null
                });
            }

            const usuarioId = usu_id || medicoExistente[0].usu_id;

            const sql = `
                UPDATE Medico
                SET
                    usu_id = ?,
                    med_crm = ?
                WHERE med_id = ?
            `;

            await db.query(sql, [usuarioId, crm, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Medico ${id} atualizado com sucesso`,
                dados: {
                    id: Number(id),
                    usu_id: Number(usuarioId),
                    crm
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar medico: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarMedico(request, response) {
        try {
            const { id } = request.params;

            const [medicoExistente] = await db.query(
                `
                SELECT med_id
                FROM Medico
                WHERE med_id = ?
                `,
                [id]
            );

            if (medicoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Medico ${id} nao encontrado!`,
                    dados: null
                });
            }

            const [atendimentosVinculados] = await db.query(
                `
                SELECT atend_id
                FROM Atendimento
                WHERE med_id = ?
                `,
                [id]
            );

            const [favoritosVinculados] = await db.query(
                `
                SELECT fav_id
                FROM Favorito
                WHERE med_id = ?
                `,
                [id]
            );

            if (atendimentosVinculados.length > 0 || favoritosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nao e possivel excluir o medico porque existem atendimentos ou favoritos vinculados a ele.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Medico
                WHERE med_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Medico ${id} excluido com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar medico: ${error.message}`,
                dados: error.message
            });
        }
    }
};
