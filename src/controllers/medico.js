const db = require('../dataBase/connection');

module.exports = {
    async listarMedico(request, response) {
        try {
            const sql = `
                SELECT 
                    med_id,
                    med_crm
                FROM Medico
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de médicos obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar médicos: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarMedico(request, response) {
        try {
            const { crm } = request.body;

            if (!crm) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM é obrigatório.',
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
                    mensagem: 'CRM já cadastrado.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Medico (med_crm)
                VALUES (?)
            `;

            const [result] = await db.query(sql, [crm]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de médico realizado com sucesso',
                dados: {
                    id: result.insertId,
                    crm
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar médico: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarMedico(request, response) {
        try {
            const { crm } = request.body;
            const { id } = request.params;

            if (!crm) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM é obrigatório.',
                    dados: null
                });
            }

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
                    mensagem: `Médico ${id} não encontrado!`,
                    dados: null
                });
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
                    mensagem: 'Já existe outro médico com este CRM.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Medico
                SET med_crm = ?
                WHERE med_id = ?
            `;

            await db.query(sql, [crm, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Médico ${id} atualizado com sucesso`,
                dados: {
                    id: Number(id),
                    crm
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar médico: ${error.message}`,
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
                    mensagem: `Médico ${id} não encontrado!`,
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

            if (atendimentosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o médico porque existem atendimentos vinculados a ele.',
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
                mensagem: `Médico ${id} excluído com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar médico: ${error.message}`,
                dados: error.message
            });
        }
    }
};