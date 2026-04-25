const db = require('../dataBase/connection');

module.exports = {
    async listarLaudo(request, response) {
        try {
            const { nome } = request.query;
            const nomePaciente = nome ? `%${nome}%` : `%`;

            const sql = `
        SELECT
            lau.lau_id,
            atd.atend_id,
            pac.pac_nome,
            conv.con_tipo,
            lei.leito_identificacao,
            seto.set_nome,
            cli.cli_descricao,
            pc.proc_cid_id,
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
        INNER JOIN Procedimento_Cids pc
            ON lau.proc_cid_id = pc.proc_cid_id
        WHERE pac.pac_nome LIKE ?
        ORDER BY lau.lau_datapreenc DESC
    `;

            const [rows] = await db.query(sql, [nomePaciente]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de laudos obtida com sucesso',
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
                procedimentoCid,
                sinais,
                internacao,
                resultado,
                recurso
            } = request.body;

            if (!atendimento || !escolhaClinica || !procedimentoCid || !sinais) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Atendimento, escolha clínica, procedimento CID e sinais são obrigatórios.',
                    dados: null
                });
            }

            const [atendimentoExistente] = await db.query(
                `
                SELECT atend_id
                FROM Atendimento
                WHERE atend_id = ?
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

            const [procedimentoCidExistente] = await db.query(
                `
                SELECT proc_cid_id
                FROM Procedimento_Cids
                WHERE proc_cid_id = ?
                `,
                [procedimentoCid]
            );

            if (procedimentoCidExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Procedimento CID não encontrado.',
                    dados: null
                });
            }

            const [laudoExistente] = await db.query(
                `
                SELECT lau_id
                FROM Laudo
                WHERE atend_id = ?
                `,
                [atendimento]
            );

            if (laudoExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe um laudo cadastrado para este atendimento.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Laudo (
                    atend_id,
                    cli_id,
                    proc_cid_id,
                    lau_sinais,
                    lau_internacao,
                    lau_resultado,
                    lau_recurso,
                    lau_datapreenc,
                    lau_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
            `;

            const values = [
                atendimento,
                escolhaClinica,
                procedimentoCid,
                sinais,
                internacao || null,
                resultado || null,
                recurso || null,
                1
            ];

            const [result] = await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de laudo realizado com sucesso',
                dados: {
                    id: result.insertId,
                    atendimento,
                    escolhaClinica,
                    procedimentoCid,
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
            const { sinais, internacao, resultado, recurso } = request.body;
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

            const sql = `
                UPDATE Laudo
                SET
                    lau_sinais = ?,
                    lau_internacao = ?,
                    lau_resultado = ?,
                    lau_recurso = ?
                WHERE lau_id = ?
            `;

            const values = [
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
    }
};