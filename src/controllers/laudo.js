const db = require('../dataBase/connection');

module.exports = {

    async listarLaudo(request, response) {
        try {
            const { nome } = request.query;
            const lau_nome = nome ? `%${nome}%` : `%`;
            const sql = `
                SELECT lau_id, Atendimento.atend_id, Paciente.pac_nome, Escolha_Clinica.cli_descricao, Procedimento_Cids.proc_cid_id, 
                lau_sinais, lau_internacao, lau_resultado, lau_recurso, lau_datapreenc, lau_status
                FROM Laudo
                INNER JOIN Atendimento ON Laudo.atend_id = Atendimento.atend_id
                INNER JOIN Paciente  ON Atendimento.pac_id = Paciente.pac_id
                INNER JOIN Escolha_Clinica  ON Laudo.cli_id = Escolha_Clinica.cli_id
                INNER JOIN Procedimento_Cids  ON Laudo.proc_cid_id = Procedimento_Cids.proc_cid_id
                WHERE Paciente.pac_nome LIKE ?
            `;

            const values = [lau_nome]
            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de laudo obtida com sucesso`,
                    nItens,
                    dados: rows
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar laudo: ${error.message}`,
                    dados: null
                }
            )
        }
    },



    async cadastrarLaudo(request, response) { // Cadastrar precisa ser verificado. 24/02/2026 ; 20:36
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { atendimento, escolhaClinica, procedimentoCid, sinais, internacao, resultado, recurso } = request.body;
            const lau_status = 1;
            const sql = `
                INSERT INTO Laudo (atend_id, cli_id, proc_cid_id, lau_sinais, lau_internacao, lau_resultado, lau_recurso, lau_datapreenc, lau_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?);
            `;

            const values = [atendimento, escolhaClinica, procedimentoCid, sinais, internacao, resultado, recurso, lau_status];
            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                atendimento,
                escolhaClinica,
                procedimentoCid,
                sinais,
                internacao,
                resultado,
                recurso
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de laudo realizado com sucesso`,
                    dados: dados
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar laudo: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async editarLaudo(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { sinais, internacao, resultado, recurso } = request.body;
            const { id } = request.params;

            const sql = `
                UPDATE Laudo SET lau_sinais = ?, lau_internacao = ?, lau_resultado = ?, lau_recurso = ?, 
                WHERE lau_id = ?
            `;

            const values = [sinais, internacao, resultado, recurso, id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Laudo com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            const dados = {
                id,
                sinais,
                internacao,
                resultado,
                recurso
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de laudo realizado com sucesso`,
                    dados: dados
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar laudo: ${error.message}`,
                    dados: null
                }
            )
        }
    },


    async apagarLaudo(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body);
            const { id } = request.params;
            const sql = `DELETE FROM Laudo WHERE lau_id = ?`;
            const values = [id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Laudo com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de laudo realizado com sucesso`,
                    dados: null
                }
            )
        }

        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir laudo: ${error.message}`,
                    dados: null
                }
            )
        }
    },
}