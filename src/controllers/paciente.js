const db = require('../dataBase/connection');

module.exports = {

    async listarPaciente(request, response) {
        try {

            const {nome} = request.query;

           const paci_nome = nome ? `%${nome}%` : `%`;
            const sql = `
                SELECT pac_id, pac_nome, pac_datanasc, pac_cpf, pac_telefone, pac_datacadastro, pac_sexo, pac_num_prontuario, pac_cns, 
                pac_nome_mae, pac_raca, pac_bairro, pac_num_casa, pac_logradouro, pac_cep, pac_uf, pac_municipio, pac_cod_ibge 
                FROM Paciente
                WHERE 
                pac_nome Like ?
                `;

                const values = [paci_nome]

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de pacientes obtida com sucesso`,
                    nItens,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao obter lista de pacientes: ${error.message}`,
                    dados: null
                }
            );
        }
    },

    async cadastrarPaciente(request, response) {
        try {

            const { nome, datanasc, cpf, telefone, sexo, num_prontuario, cns, nome_mae, raca, bairro, num_casa, logradouro, cep, uf, municipio, cod_ibge } = request.body;

            const sql = `
  INSERT INTO Paciente (
        pac_nome, pac_datanasc, pac_cpf, pac_telefone, pac_datacadastro, pac_sexo, pac_num_prontuario, pac_cns, 
                pac_nome_mae, pac_raca, pac_bairro, pac_num_casa, pac_logradouro, pac_cep, pac_uf, pac_municipio, pac_cod_ibge 
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);
        `;


            const values = [

                nome,
                datanasc,
                cpf,
                telefone,
                new Date(),
                sexo,
                num_prontuario,
                cns,
                nome_mae,
                raca,
                bairro,
                num_casa,
                logradouro,
                cep,
                uf,
                municipio,
                cod_ibge


            ];


            const [result] = await db.query(sql, values);


            const dados = {
                id: result.insertId,
                nome,
                datanasc,
                cpf,
                telefone,
                sexo,
                num_prontuario,
                cns,
                nome_mae,
                raca,
                bairro,
                num_casa,
                logradouro,
                cep,
                uf,
                municipio,
                cod_ibge

            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de paciente obtido com sucesso',
                    dados: dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar paciente: ${error.message} `,
                    dados: error.message
                }
            );
        }

    },

    async editarPaciente(request, response) {
        try {

            const { nome, datanasc, cpf, telefone, sexo, num_prontuario, cns, nome_mae, raca, bairro, num_casa, logradouro, cep, uf, municipio, cod_ibge } = request.body;

            const { id } = request.params;

            const sql = ` UPDATE Paciente SET 
            pac_nome = ?, pac_datanasc = ?, pac_cpf = ?, pac_telefone = ?, pac_sexo = ?, pac_num_prontuario = ?, pac_cns = ?, 
            pac_nome_mae = ?, pac_raca = ?, pac_bairro = ?, pac_num_casa = ?, pac_logradouro = ?, pac_cep = ?, pac_uf = ?, pac_municipio = ?, pac_cod_ibge = ?
            WHERE 
            pac_id = ?
             `;

            const values = [nome, datanasc, cpf, telefone, sexo, num_prontuario, cns, nome_mae, raca, bairro, num_casa, logradouro, cep, uf, municipio, cod_ibge, id];

            const [result] = await db.query(sql, values);


            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Paciente ${id} não encontrado!`,
                    dados: null
                });
            }

            const dados = {
                id,
                nome,
                datanasc,
                cpf,
                telefone,
                sexo,
                num_prontuario,
                cns,
                nome_mae,
                raca,
                bairro,
                num_casa,
                logradouro,
                cep,
                uf,
                municipio,
                cod_ibge
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Paciente ${id} atualizado com sucesso!`,
                    dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar Paciente: ${error.message} `,
                    dados: error.message
                }
            );
        }

    },

    async apagarPaciente(request, response) {
        try {

            const { id } = request.params;

            const sql = `DELETE FROM Paciente where pac_id = ?`;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Paciente ${id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Paciente ${id} excluído com sucesso`,
                    dados: null

                }
            );

        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar paciente: ${error.message} `,
                    dados: error.message
                }
            );
        }
    },
}