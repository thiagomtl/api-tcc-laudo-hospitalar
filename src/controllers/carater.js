const db = require('../dataBase/connection');

module.exports = {

    async listarCarater(request, response) {
        try {
            const sql = `
                SELECT set_id, set_nome 
                FROM Setor;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de carater obtida com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao obter lista de carater: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },

    async cadastrarCarater(request, response) {
        try {
            const sql = `
                SELECT car_id, car_tipo 
                FROM Carater;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de carater realizado com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastra carater: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async editarCarater(request, response) {
        try {
            const sql = `
                SELECT car_id, car_tipo 
                FROM Carater;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de carater obtida com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar carater: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },

    async apagarCarater(request, response) {
        try {
            const sql = `
                SELECT car_id, car_tipo 
                FROM Carater;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de carater apagada com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar lista de carater: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },
}