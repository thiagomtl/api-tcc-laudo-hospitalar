const db = require('../dataBase/connection');

module.exports = {
    async listarAtendimento(request, response) {
        try {
            
            const sql = `
            SELECT 
                atend_id, pac_id, con_id, 
                leito_id, car_id, med_id, atend_data 
            FROM Atendimento;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de atendimento obtida com sucesso',
                    itens: rows.length,
                    dados: rows

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarAtendimento(request, response) {
        try {
            console.log("BODY RECEBIDO:", request.body); // <-- coloque aqui
            const { paciente, convenio, leito, carater, medico } = request.body;

            const sql = `
            INSERT INTO Atendimento 
            (pac_id, con_id, leito_id, car_id, med_id, atend_data) 
            VALUES
            (?,?,?,?,?,NOW());
            `;

            const values = [paciente, convenio, leito, carater, medico,];

            const [result] = await db.query(sql, values);
            
            const dados = {
                id: result.insertId,
                paciente,
                convenio,
                leito,
                carater,
                medico
            };
            
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de atendimento realizado com sucesso',
                    dados: dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar atendimento: ${error.message}`,
                    dados: error.message
                }
            );
        }

    },
    async editarAtendimento(request, response) {
        try {

            const { paciente, convenio, leito, carater, medico } = request.body

            const { id } = request.params;

            const sql = `
            UPDATE Atendimento 
            SET pac_id = ?, con_id = ?, leito_id = ?, car_id = ?, med_id = ?, atend_data = NOW()
            WHERE atend_id = ?;
            `;

            const values = [paciente, convenio, leito, carater, medico, id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Atendimento ID ${id} não encontrado`,
                    dados: null
                });
            }

            const dados = {
                id,
                paciente,
                convenio,
                leito,
                carater,
                medico
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atendimento ID ${id} atualizado com sucesso`,
                    dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async apagarAtendimento(request, response) {
        try {

            const { id } = request.params;

            const sql = `DELETE FROM Atendimento WHERE atend_id = ?`;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Atendimento ID ${id} não encontrado para exclusão`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Exclusão ID ${id} de atendimento obtida com sucesso`,
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar atendimento: ${error.message}`,
                    dados: null
                }
            );
        }

    },


}