const db = require("../dataBase/connection");

async function registrarLog({ usuarioId = null, acao, descricao }) {
    try {
        console.log("REGISTRANDO LOG:", { usuarioId, acao, descricao });

        const sql = `
            INSERT INTO logs_acao (
                usu_id,
                log_acao,
                log_detalhe,
                log_datahora
            )
            VALUES (?, ?, ?, NOW())
        `;

        const [result] = await db.query(sql, [
            usuarioId,
            acao,
            descricao
        ]);

        console.log("LOG CADASTRADO ID:", result.insertId);
    } catch (error) {
        console.log("ERRO AO REGISTRAR LOG:", error.message);
    }
}

async function listarLogs(request, response) {
    try {
        const sql = `
            SELECT
                log.log_id,
                log.usu_id,
                usu.usu_nome,
                usu.usu_tipo,
                log.log_acao,
                log.log_detalhe,
                log.log_datahora
            FROM logs_acao log
            LEFT JOIN Usuario usu
                ON log.usu_id = usu.usu_id
            ORDER BY log.log_datahora DESC
        `;

        const [rows] = await db.query(sql);

        return response.status(200).json({
            sucesso: true,
            mensagem: "Logs obtidos com sucesso",
            itens: rows.length,
            dados: rows
        });
    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: `Erro ao listar logs: ${error.message}`,
            dados: null
        });
    }
}

module.exports = {
    registrarLog,
    listarLogs
};