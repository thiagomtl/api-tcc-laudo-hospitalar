const db = require('../dataBase/connection');

module.exports = {
    async listarInstituicao(request, response) {
        try {

            const sql = `SELECT inst_id, inst_nome, inst_razao_social, inst_cnes, inst_cnpj 
             FROM Instituicao;`
                ;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de instituição obtida com sucesso',
                    itens: rows.length,
                    dados: rows

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar instituição: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarInstituicao(request, response) {
        try {
            const { nome, razao_social, cnes, cnpj} = request.body;
            

            const sql =  `
                    INSERT INTO Instituicao (inst_nome, inst_razao_social, inst_cnes, inst_cnpj) 
                    VALUES (?, ?, ?, ?,);
                    `;

            const values = [nome,cnpj,razao_social,cnes]; 

    

            const dados = {
                nome,
                cnes,
                cnpj,
                razao_social
                
            };



             

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de instituição obtida com sucesso',
                      dados: dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar instituição: ${error.message}`,
                    dados: error.message
                }
            );
        }

    },
    async editarInstituicao(request, response) {
        try {

            

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de instituição obtida com sucesso',
                     dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar instituição: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarInstituicao(request, response) {
        try {

            

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de instituição obtida com sucesso',
                     dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar instituição: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}