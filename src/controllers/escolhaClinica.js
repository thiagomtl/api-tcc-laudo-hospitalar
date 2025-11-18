const db = require('../dataBase/connection');

module.exports = {
    
    async listarEscolhaClinica(request, response) {
        try {
            const sql = `
                SELECT cli_id, cli_descricao 
                FROM Escolha_Clinica;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de escolhas clínicas obtidas com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar escolha clínica: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async  cadastrarEscolhaClinica(request, response) {
        try {const sql = `
                SELECT cli_id, cli_descricao 
                FROM Escolha_Clinica;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de escolha clínica realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar escolha clínica: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async editarEscolhaClinica (request, response) {
        try {
            const sql = `
                SELECT cli_id, cli_descricao 
                FROM Escolha_Clinica;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de escolha clínica realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar escolha clínica: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },

    async apagarEscolhaClinica (request, response) {
        try {
            const sql = `
                SELECT cli_id, cli_descricao 
                FROM Escolha_Clinica;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão de escolha clínica realizados com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            )
        } 
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao excluir escolha clínica: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            )
        }
    },
}