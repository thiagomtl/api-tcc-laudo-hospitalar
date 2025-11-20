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
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de atendimento obtida com sucesso',
                    dados: null

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
            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de atendimento obtida com sucesso',
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