const db = require('../dataBase/connection');

module.exports = {

    async listarSetor(request, response) {
        try {
            const sql = `
                SELECT set_id, set_nome 
                FROM Setor;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de setores obtida com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao obter lista de setores: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },

    async cadastrarSetor(request, response) {
        try {
            const sql = `
                SELECT set_id, set_nome 
                FROM Setor;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de setor realizado com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar setor: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async editarSetor(request, response) {
        try {
            const sql = `
                SELECT set_id, set_nome 
                FROM Setor;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de setores obtida com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );

        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar setores: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },

    async apagarSetor(request, response) {
        try {
            const sql = `
                SELECT set_id, set_nome 
                FROM Setor;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de setores apagada com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar lista de setores: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },
}