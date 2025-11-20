const db = require('../dataBase/connection');

module.exports = {
    async listarFavorito(request, response) {
        try {

            const sql = `SELECT fav_id, lau_id, med_id, fav_nome FROM Favorito;`
                ;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de favorito obtida com sucesso',
                    itens: rows.length,
                    dados: rows
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar favorito: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarFavorito(request, response) {
        try {

            const { lauid,medid,nome } = request.body;
            

            const sql =  `
                   INSERT INTO Favorito (lau_id, med_id, fav_nome) 
                   VALUES (?, ?, ?);
                    `;


    
            const values = [nome,lauid,medid]; 

           

            const dados = {
               
                nome,
               lauid,
                medid,
                
            };

            

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de favorito obtida com sucesso',
                     dados: dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar favorito: ${error.message}`,
                    dados: error.message
                }
            );
        }

    },
    async editarFavorito(request, response) {
        try {

            

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de favorito obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar favorito: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarFavorito(request, response) {
        try {

           

            

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de favorito obtida com sucesso',
                     dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar favorito: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}