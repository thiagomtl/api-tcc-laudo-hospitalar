const db = require('../dataBase/connection');
const { registrarLog } = require("./logsAcao");
const normalizarTextoLaudo = require('../utils/normalizarTextoLaudo');

function normalizarTipoUsuario(tipo) {
    return String(tipo || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function usuarioEhMedico(usuario) {
    return normalizarTipoUsuario(usuario?.tipo) === 'medico' || !!usuario?.med_id;
}

function aplicarFiltroMedicoLogado(sql, params, usuario, aliasMedico = 'med') {
    if (!usuarioEhMedico(usuario)) {
        return sql;
    }

    if (usuario.med_id) {
        params.push(usuario.med_id);
        return `${sql} AND ${aliasMedico}.med_id = ? `;
    }

    params.push(usuario.usu_id || usuario.id);
    return `${sql} AND ${aliasMedico}.usu_id = ? `;
}

module.exports = {
    async listarLaudo(request, response) {
        try {
            const {
                nome,
                convenio,
                setor,
                medico,
                dataInicio,
                dataFim,
                historico
            } = request.query;

            let sql = `
            SELECT
                lau.lau_id,
                atd.atend_id,

                pac.pac_id,
                pac.pac_nome,
                pac.pac_datanasc,
                pac.pac_cpf,
                pac.pac_telefone,
                pac.pac_sexo,
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
                cli.cli_descricao,

                cid.cid_id,
                cid.cid_codigo,
                cid.cid_descricao,

                pro.pro_id,
                pro.pro_codigo,
                pro.pro_descricao,

                med.med_id,
                u.usu_nome AS med_nome,
                u.usu_email AS med_email,
                med.med_crm,
                u.usu_documento AS med_cpf,

                inst.inst_id,
                inst.inst_nome,
                inst.inst_cnes,

                lau.lau_sinais,
                lau.lau_internacao,
                lau.lau_resultado,
                lau.lau_recurso,
                lau.lau_datapreenc,
                CAST(lau.lau_status AS UNSIGNED) AS lau_status

            FROM Laudo lau

            INNER JOIN Atendimento atd
                ON lau.atend_id = atd.atend_id

            INNER JOIN Paciente pac
                ON atd.pac_id = pac.pac_id

            INNER JOIN Convenio conv
                ON atd.con_id = conv.con_id

            INNER JOIN Leito lei
                ON atd.leito_id = lei.leito_id

            INNER JOIN Setor seto
                ON lei.set_id = seto.set_id

            INNER JOIN Escolha_Clinica cli
                ON lau.cli_id = cli.cli_id

            INNER JOIN CID cid
                ON lau.cid_id = cid.cid_id

            INNER JOIN Procedimento pro
                ON lau.pro_id = pro.pro_id

            INNER JOIN Medico med
                ON atd.med_id = med.med_id

            INNER JOIN Usuario u
                ON med.usu_id = u.usu_id

            LEFT JOIN Instituicao inst
                ON inst.inst_id = 1

            WHERE 1 = 1
            ${historico === "1" ? "AND lau.lau_status = 2" : "AND lau.lau_status = 1"}
        `;

            const params = [];

            if (nome) {
                sql += ` AND pac.pac_nome LIKE ? `;
                params.push(`%${normalizarTextoLaudo(nome)}%`);
            }

            if (convenio) {
                sql += ` AND conv.con_tipo LIKE ? `;
                params.push(`%${convenio}%`);
            }

            if (setor) {
                sql += ` AND seto.set_nome LIKE ? `;
                params.push(`%${normalizarTextoLaudo(setor)}%`);
            }

            if (medico) {
                sql += ` AND (
                    u.usu_nome LIKE ?
                    OR u.usu_email LIKE ?
                    OR med.med_crm LIKE ?
                    OR med.med_id = ?
                ) `;
                params.push(`%${medico}%`, `%${medico}%`, `%${medico}%`, Number(medico) || 0);
            }

            if (dataInicio) {
                sql += ` AND DATE(lau.lau_datapreenc) >= ? `;
                params.push(dataInicio);
            }

            if (dataFim) {
                sql += ` AND DATE(lau.lau_datapreenc) <= ? `;
                params.push(dataFim);
            }

            sql = aplicarFiltroMedicoLogado(sql, params, request.usuario);

            sql += ` ORDER BY lau.lau_datapreenc DESC `;

            const [rows] = await db.query(sql, params);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de laudos obtida com sucesso",
                itens: rows.length,
                dados: rows
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar laudos: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarLaudo(request, response) {
        try {
            const {
                atendimento,
                escolhaClinica,
                cid,
                procedimento,
                sinais,
                internacao,
                resultado,
                recurso
            } = request.body;

            if (
                !atendimento ||
                !escolhaClinica ||
                !cid ||
                !procedimento ||
                !sinais ||
                !internacao ||
                !resultado ||
                !recurso
            ) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Todos os campos obrigatórios devem ser preenchidos.',
                    dados: null
                });
            }

            const [atendimentoExistente] = await db.query(
                `
                SELECT
                    atd.atend_id,
                    med.med_id,
                    med.usu_id
                FROM Atendimento atd
                INNER JOIN Medico med ON med.med_id = atd.med_id
                WHERE atd.atend_id = ?
                `,
                [atendimento]
            );

            if (atendimentoExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Atendimento não encontrado.',
                    dados: null
                });
            }

            if (usuarioEhMedico(request.usuario)) {
                const usuarioId = request.usuario.usu_id || request.usuario.id;
                const medicoId = request.usuario.med_id;

                if (
                    Number(atendimentoExistente[0].usu_id) !== Number(usuarioId) &&
                    Number(atendimentoExistente[0].med_id) !== Number(medicoId)
                ) {
                    return response.status(403).json({
                        sucesso: false,
                        mensagem: 'Este atendimento nao pertence ao medico autenticado.',
                        dados: null
                    });
                }
            }

            const [clinicaExistente] = await db.query(
                `
                SELECT cli_id
                FROM Escolha_Clinica
                WHERE cli_id = ?
                `,
                [escolhaClinica]
            );

            if (clinicaExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Escolha clínica não encontrada.',
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

            const sql = `
                INSERT INTO Laudo (
                    atend_id,
                    cli_id,
                    cid_id,
                    pro_id,
                    lau_sinais,
                    lau_internacao,
                    lau_resultado,
                    lau_recurso,
                    lau_datapreenc,
                    lau_status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
            `;

            const values = [
                atendimento,
                escolhaClinica,
                cid,
                procedimento,
                sinais,
                internacao || null,
                resultado || null,
                recurso || null,
                1
            ];

            const [result] = await db.query(sql, values);
            console.log("CHEGOU NO LOG DO LAUDO");
            console.log("USUÁRIO:", request.usuario);
            await registrarLog({
                usuarioId: request.usuario?.usu_id || request.usuario?.id || null,
                acao: "CADASTRO_LAUDO",
                descricao: `Laudo cadastrado para o atendimento ${atendimento}`
            });

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de laudo realizado com sucesso',
                dados: {
                    id: result.insertId,
                    atendimento,
                    escolhaClinica,
                    cid,
                    procedimento,
                    sinais,
                    internacao,
                    resultado,
                    recurso,
                    status: 1
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar laudo: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarLaudo(request, response) {
        try {
            const {
                cid,
                procedimento,
                sinais,
                internacao,
                resultado,
                recurso
            } = request.body;

            const { id } = request.params;

            if (!sinais) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O campo sinais é obrigatório.',
                    dados: null
                });
            }

            const [laudoExistente] = await db.query(
                `
                SELECT lau_id
                FROM Laudo
                WHERE lau_id = ?
                `,
                [id]
            );

            if (laudoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Laudo com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            if (cid) {
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
            }

            if (procedimento) {
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
            }

            const sql = `
                UPDATE Laudo
                SET
                    cid_id = COALESCE(?, cid_id),
                    pro_id = COALESCE(?, pro_id),
                    lau_sinais = ?,
                    lau_internacao = ?,
                    lau_resultado = ?,
                    lau_recurso = ?
                WHERE lau_id = ?
            `;

            const values = [
                cid || null,
                procedimento || null,
                sinais,
                internacao || null,
                resultado || null,
                recurso || null,
                id
            ];

            await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Atualização de laudo realizada com sucesso',
                dados: {
                    id: Number(id),
                    cid: cid || null,
                    procedimento: procedimento || null,
                    sinais,
                    internacao,
                    resultado,
                    recurso
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar laudo: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarLaudo(request, response) {
        try {
            const { id } = request.params;

            const [laudoExistente] = await db.query(
                `
                SELECT lau_id
                FROM Laudo
                WHERE lau_id = ?
                `,
                [id]
            );

            if (laudoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Laudo com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Laudo
                WHERE lau_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Exclusão de laudo realizada com sucesso',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao excluir laudo: ${error.message}`,
                dados: error.message
            });
        }
    },

    async marcarLaudoComoImpresso(request, response) {
        try {
            const { id } = request.params;

            const [laudoExistente] = await db.query(
                'SELECT lau_id FROM Laudo WHERE lau_id = ?',
                [id]
            );

            if (laudoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Laudo não encontrado.',
                    dados: null
                });
            }

            await db.query(
                'UPDATE Laudo SET lau_status = 2 WHERE lau_id = ?',
                [id]
            );

            await registrarLog({
                usuarioId: request.usuario?.usu_id || request.usuario?.id || null,
                acao: "IMPRESSAO_LAUDO",
                descricao: `Laudo impresso/enviado para histórico: ID ${id}`
            });

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Laudo enviado para histórico com sucesso.',
                dados: {
                    id: Number(id),
                    status: 2
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar status do laudo: ${error.message}`,
                dados: error.message
            });
        }
    }
};
