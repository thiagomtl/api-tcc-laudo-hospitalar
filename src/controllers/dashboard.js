const db = require('../dataBase/connection');

module.exports = {
    async resumoDashboard(request, response) {
        try {
            const [[pendentes]] = await db.query(`
                SELECT COUNT(*) AS total
                FROM Atendimento a
                LEFT JOIN Laudo l ON a.atend_id = l.atend_id
                WHERE l.lau_id IS NULL
            `);

            const [[concluidos]] = await db.query(`
                SELECT COUNT(*) AS total
                FROM Laudo
            `);

            const [[usuarios]] = await db.query(`
                SELECT COUNT(*) AS total
                FROM Usuario
                WHERE usu_status = 1
            `);

            const [[atendimentos]] = await db.query(`
                SELECT COUNT(*) AS total
                FROM Atendimento
            `);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Resumo do dashboard obtido com sucesso',
                dados: {
                    laudosPendentes: pendentes.total,
                    laudosConcluidos: concluidos.total,
                    usuariosAtivos: usuarios.total,
                    atendimentos: atendimentos.total
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao carregar dashboard: ${error.message}`,
                dados: null
            });
        }
    }
};