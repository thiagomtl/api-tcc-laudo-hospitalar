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

            const { lau_id, med_id, fav_nome } = request.body;


            const sql = `
                   INSERT INTO Favorito (lau_id, med_id, fav_nome) 
                   VALUES (?, ?, ?);
                    `;



            const values = [lau_id, med_id, fav_nome];

            const [result] = await db.query(sql, values);



            const dados = {
                id: result.insertId,
                lau_id,
                med_id,
                fav_nome,
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

             const { lau_id, med_id, fav_nome } = request.body;

            const { id } = request.params;

            const sql = ` UPDATE Favorito SET 
             lau_id = ?, med_id = ?, fav_nome = ?
             WHERE 
             fav_id = ?
             `;

             const values = [lau_id,med_id,fav_nome ,id];

            const [result] = await db.query(sql,values);


            if (result.affectedRows === 0){
                return response.status(404).json({
                    sucesso:false,
                    mensagem:`Favorito ${id} não encontrado!`,
                    dados:null
                });
            }

            const dados ={
                id,
                lau_id,
                med_id,
                fav_nome
                
            };




            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Favorito ${id} atualizado com sucesso!`,
                    dados: dados

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


            const { id } = request.params;

            const sql = `DELETE FROM Favorito where fav_id = ?`;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0){
                return response.status(404).json({
                    sucesso:false,
                    mensagem:`Favorito ${id} não encontrado!`,
                    dados:null
                });
            }


            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Favorito ${id} excluído com sucesso`,
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