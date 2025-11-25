const db = require('../dataBase/connection');

module.exports = {
    async listarMedico(request, response) {
        try {
            const sql = `SELECT med_id, med_crm FROM Medico;`
                ;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de médico obtida com sucesso',
                    itens: rows.length,
                    dados: rows

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar médico: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarMedico(request, response) {
        try {

            const {crm } = request.body;
           

            const sql =  `
                   INSERT INTO Medico (med_crm) 
                   VALUES
                   (?);
                    `;


    
            const values = [crm]; 

            const [result] = await db.query(sql, values);

            

            const dados = {
                id: result.insertId,
                crm
                
            };

            

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de médico obtida com sucesso',
                    dados: dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar médico: ${error.message}`,
                    dados: error.message
                }
            );
        }

    },
    async editarMedico(request, response) {
        try {

            const { crm } = request.body;

            const { id } = request.params;

            const sql = ` UPDATE Medico SET 
             med_crm = ?
             WHERE 
             med_id = ?
             `;

             const values = [crm ,id];

            const [result] = await db.query(sql,values);


            if (result.affectedRows === 0){
                return response.status(404).json({
                    sucesso:false,
                    mensagem:`Médico ${id} não encontrado!`,
                    dados:null
                });
            }

            const dados ={
                id,
                crm
                
            };

           

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Médico ${id} atualizado com sucesso`,
                    dados:dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar médico: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarMedico(request, response) {
        try {

             const { id } = request.params;

            const sql = `DELETE FROM Medico where med_id = ?`;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0){
                return response.status(404).json({
                    sucesso:false,
                    mensagem:`Médico ${id} não encontrado!`,
                    dados:null
                });
            }

           

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Médico ${id} excluído com sucesso`,
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar médico: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}