const db = require('../dataBase/connection');

module.exports = {
    async listarAtendimento(request, response) {
        try {
            const sql = `
                SELECT
                    atend_id,
                    pac_id,
                    con_id,
                    leito_id,
                    car_id,
                    med_id,
                    atend_data
                FROM Atendimento
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de atendimentos obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar atendimentos: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarAtendimento(request, response) {
        try {
            const { paciente, convenio, leito, carater, medico } = request.body;

            if (!paciente || !convenio || !leito || !carater || !medico) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Paciente, convênio, leito, caráter e médico são obrigatórios.',
                    dados: null
                });
            }

            const [pacienteExistente] = await db.query(
                `
                SELECT pac_id
                FROM Paciente
                WHERE pac_id = ?
                `,
                [paciente]
            );

            if (pacienteExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Paciente não encontrado.',
                    dados: null
                });
            }

            const [convenioExistente] = await db.query(
                `
                SELECT con_id
                FROM Convenio
                WHERE con_id = ?
                `,
                [convenio]
            );

            if (convenioExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Convênio não encontrado.',
                    dados: null
                });
            }

            const [leitoExistente] = await db.query(
                `
                SELECT leito_id
                FROM Leito
                WHERE leito_id = ?
                `,
                [leito]
            );

            if (leitoExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Leito não encontrado.',
                    dados: null
                });
            }

            const [caraterExistente] = await db.query(
                `
                SELECT car_id
                FROM Carater
                WHERE car_id = ?
                `,
                [carater]
            );

            if (caraterExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Caráter não encontrado.',
                    dados: null
                });
            }

            const [medicoExistente] = await db.query(
                `
                SELECT med_id
                FROM Medico
                WHERE med_id = ?
                `,
                [medico]
            );

            if (medicoExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Médico não encontrado.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Atendimento (
                    pac_id,
                    con_id,
                    leito_id,
                    car_id,
                    med_id,
                    atend_data
                ) VALUES (?, ?, ?, ?, ?, NOW())
            `;

            const values = [paciente, convenio, leito, carater, medico];
            const [result] = await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de atendimento realizado com sucesso',
                dados: {
                    id: result.insertId,
                    paciente,
                    convenio,
                    leito,
                    carater,
                    medico
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar atendimento: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarAtendimento(request, response) {
        try {
            const { paciente, convenio, leito, carater, medico } = request.body;
            const { id } = request.params;

            if (!paciente || !convenio || !leito || !carater || !medico) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Paciente, convênio, leito, caráter e médico são obrigatórios.',
                    dados: null
                });
            }

            const [atendimentoExistente] = await db.query(
                `
                SELECT atend_id
                FROM Atendimento
                WHERE atend_id = ?
                `,
                [id]
            );

            if (atendimentoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Atendimento ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const [pacienteExistente] = await db.query(
                `
                SELECT pac_id
                FROM Paciente
                WHERE pac_id = ?
                `,
                [paciente]
            );

            if (pacienteExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Paciente não encontrado.',
                    dados: null
                });
            }

            const [convenioExistente] = await db.query(
                `
                SELECT con_id
                FROM Convenio
                WHERE con_id = ?
                `,
                [convenio]
            );

            if (convenioExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Convênio não encontrado.',
                    dados: null
                });
            }

            const [leitoExistente] = await db.query(
                `
                SELECT leito_id
                FROM Leito
                WHERE leito_id = ?
                `,
                [leito]
            );

            if (leitoExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Leito não encontrado.',
                    dados: null
                });
            }

            const [caraterExistente] = await db.query(
                `
                SELECT car_id
                FROM Carater
                WHERE car_id = ?
                `,
                [carater]
            );

            if (caraterExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Caráter não encontrado.',
                    dados: null
                });
            }

            const [medicoExistente] = await db.query(
                `
                SELECT med_id
                FROM Medico
                WHERE med_id = ?
                `,
                [medico]
            );

            if (medicoExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Médico não encontrado.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Atendimento
                SET
                    pac_id = ?,
                    con_id = ?,
                    leito_id = ?,
                    car_id = ?,
                    med_id = ?,
                    atend_data = NOW()
                WHERE atend_id = ?
            `;

            const values = [paciente, convenio, leito, carater, medico, id];
            await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Atendimento ID ${id} atualizado com sucesso`,
                dados: {
                    id: Number(id),
                    paciente,
                    convenio,
                    leito,
                    carater,
                    medico
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar atendimento: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarAtendimento(request, response) {
        try {
            const { id } = request.params;

            const [atendimentoExistente] = await db.query(
                `
                SELECT atend_id
                FROM Atendimento
                WHERE atend_id = ?
                `,
                [id]
            );

            if (atendimentoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Atendimento ID ${id} não encontrado para exclusão.`,
                    dados: null
                });
            }

            const [laudosVinculados] = await db.query(
                `
                SELECT lau_id
                FROM Laudo
                WHERE atend_id = ?
                `,
                [id]
            );

            if (laudosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o atendimento porque existem laudos vinculados a ele.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Atendimento
                WHERE atend_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Atendimento ID ${id} excluído com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao excluir atendimento: ${error.message}`,
                dados: error.message
            });
        }
    },

    async listarAtend(request, response) {
        try {
            const sql = `
                SELECT DISTINCT
                    atend_id
                FROM Atendimento
                ORDER BY atend_id ASC
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de IDs de atendimento obtida com sucesso.',
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async listarAtendimentosPendentes(request, response) {
        try {
            const {
                nome,
                convenio,
                setor,
                medico,
                dataInicio,
                dataFim
            } = request.query;

            let sql = `
            SELECT
                atd.atend_id,
                pac.pac_id,
                pac.pac_nome,
                pac.pac_datanasc,
                pac.pac_cpf,
                pac.pac_telefone,
                pac.pac_datacadastro,
                CAST(pac.pac_sexo AS UNSIGNED) AS pac_sexo,
                pac.pac_num_prontuario,
                pac.pac_cns,
                pac.pac_nome_mae,
                pac.pac_raca,
                pac.pac_bairro,
                pac.pac_num_casa,
                pac.pac_logradouro,
                pac.pac_cep,
                pac.pac_uf,
                pac.pac_municipio,
                pac.pac_cod_ibge,
                conv.con_tipo,
                lei.leito_identificacao,
                seto.set_nome,
                med.med_id,
                med.med_nome,
                atd.atend_data
            FROM Atendimento atd
            INNER JOIN Paciente pac ON atd.pac_id = pac.pac_id
            INNER JOIN Convenio conv ON atd.con_id = conv.con_id
            INNER JOIN Leito lei ON atd.leito_id = lei.leito_id
            INNER JOIN Setor seto ON lei.set_id = seto.set_id
            INNER JOIN Medico med ON atd.med_id = med.med_id
            LEFT JOIN Laudo lau ON lau.atend_id = atd.atend_id
            WHERE lau.lau_id IS NULL
        `;

            const params = [];

            if (nome) {
                sql += ` AND pac.pac_nome LIKE ? `;
                params.push(`%${nome}%`);
            }

            if (convenio) {
                sql += ` AND conv.con_tipo LIKE ? `;
                params.push(`%${convenio}%`);
            }

            if (setor) {
                sql += ` AND seto.set_nome LIKE ? `;
                params.push(`%${setor}%`);
            }

            if (medico) {
                sql += ` AND med.med_nome LIKE ? `;
                params.push(`%${medico}%`);
            }

            if (dataInicio) {
                sql += ` AND DATE(atd.atend_data) >= ? `;
                params.push(dataInicio);
            }

            if (dataFim) {
                sql += ` AND DATE(atd.atend_data) <= ? `;
                params.push(dataFim);
            }

            sql += ` ORDER BY atd.atend_data DESC `;

            const [rows] = await db.query(sql, params);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de atendimentos pendentes obtida com sucesso",
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar atendimentos pendentes: ${error.message}`,
                dados: error.message
            });
        }
    }
};
