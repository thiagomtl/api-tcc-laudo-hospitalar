const db = require('../dataBase/connection');

module.exports = {
    async listarConvenio(request, response) {
        try {

            const sql = `
            SELECT 
                con_id, con_tipo 
            FROM Convenio;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de convênio obtida com sucesso',
                    itens: rows.length,
                    dados: rows

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao convênio atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarConvenio(request, response) {
        try {

            const { convenios } = request.body;

            const placeholders = convenios.map(() => "(?)").join(",");

            const sql = `
            INSERT INTO Convenio (con_tipo)
            VALUES ${placeholders};
        `;

            const [result] = await db.query(sql, convenios);

            const dados = {
                primeiroIdInserido: result.insertId,
                quantidadeInserida: result.affectedRows,
                conveniosCadastrados: convenios
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Convênios cadastrados com sucesso',
                dados: dados
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar convênios: ${error.message}`,
                dados: error.message
            });
        }
    },
    async editarConvenio(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de convênio obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar convênio: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarConvenio(request, response) {
        try {
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de convênio obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar convênio: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}