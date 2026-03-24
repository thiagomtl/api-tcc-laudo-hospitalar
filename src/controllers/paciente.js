const db = require('../dataBase/connection');

module.exports = {

    async listarPaciente(request, response) {
        try {
            const sql = `
                SELECT pac_id, pac_nome, pac_datanasc, pac_cpf, pac_telefone, pac_datacadastro, pac_sexo, pac_num_prontuario, pac_cns, 
                pac_nome_mae, pac_raca, pac_bairro, pac_num_casa, pac_logradouro, pac_cep, pac_uf, pac_municipio, pac_cod_ibge 
                FROM Paciente;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de pacientes obtida com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao obter lista de pacientes: ${error.message}`,
                    itens: rows.length,
                    dados: rows
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
            const sql = `
                SELECT pac_id, pac_nome, pac_datanasc, pac_cpf, pac_telefone, pac_datacadastro, pac_sexo, pac_num_prontuario, pac_cns, 
                pac_nome_mae, pac_raca, pac_bairro, pac_num_casa, pac_logradouro, pac_cep, pac_uf, pac_municipio, pac_cod_ibge 
                FROM Paciente;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de pacientes obtida com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar pacientes: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },

    async apagarPaciente(request, response) {
        try {
            const sql = `
                SELECT pac_id, pac_nome, pac_datanasc, pac_cpf, pac_telefone, pac_datacadastro, pac_sexo, pac_num_prontuario, pac_cns, 
                pac_nome_mae, pac_raca, pac_bairro, pac_num_casa, pac_logradouro, pac_cep, pac_uf, pac_municipio, pac_cod_ibge 
                FROM Paciente;
                `;
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Lista de pacientes apagada com sucesso`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar lista de pacientes: ${error.message}`,
                    itens: rows.length,
                    dados: rows
                }
            );
        }
    },
}