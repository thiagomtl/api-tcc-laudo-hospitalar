const db = require('../dataBase/connection');

module.exports = {
    async listarPaciente(request, response) {
        try {
            const { nome } = request.query;
            const pacienteNome = nome ? `%${nome}%` : `%`;

            const sql = `
                SELECT
                    pac_id,
                    pac_nome,
                    pac_datanasc,
                    pac_cpf,
                    pac_telefone,
                    pac_datacadastro,
                    pac_sexo,
                    pac_num_prontuario,
                    pac_cns,
                    pac_nome_mae,
                    pac_raca,
                    pac_bairro,
                    pac_num_casa,
                    pac_logradouro,
                    pac_cep,
                    pac_uf,
                    pac_municipio,
                    pac_cod_ibge
                FROM Paciente
                WHERE pac_nome LIKE ?
            `;

            const [rows] = await db.query(sql, [pacienteNome]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de pacientes obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao obter lista de pacientes: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarPaciente(request, response) {
        try {
            const {
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
            } = request.body;

            if (!nome || !cpf || !num_prontuario) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome, CPF e número de prontuário são obrigatórios.',
                    dados: null
                });
            }

            if (!/^\d{11}$/.test(String(cpf))) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF deve conter 11 dígitos numéricos.',
                    dados: null
                });
            }

            const [cpfExistente] = await db.query(
                `
                SELECT pac_id
                FROM Paciente
                WHERE pac_cpf = ?
                `,
                [cpf]
            );

            if (cpfExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe paciente cadastrado com este CPF.',
                    dados: null
                });
            }

            const [prontuarioExistente] = await db.query(
                `
                SELECT pac_id
                FROM Paciente
                WHERE pac_num_prontuario = ?
                `,
                [num_prontuario]
            );

            if (prontuarioExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe paciente cadastrado com este número de prontuário.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Paciente (
                    pac_nome,
                    pac_datanasc,
                    pac_cpf,
                    pac_telefone,
                    pac_datacadastro,
                    pac_sexo,
                    pac_num_prontuario,
                    pac_cns,
                    pac_nome_mae,
                    pac_raca,
                    pac_bairro,
                    pac_num_casa,
                    pac_logradouro,
                    pac_cep,
                    pac_uf,
                    pac_municipio,
                    pac_cod_ibge
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                nome,
                datanasc || null,
                cpf,
                telefone || null,
                new Date(),
                sexo ?? null,
                num_prontuario,
                cns || null,
                nome_mae || null,
                raca || null,
                bairro || null,
                num_casa || null,
                logradouro || null,
                cep || null,
                uf || null,
                municipio || null,
                cod_ibge || null
            ];

            const [result] = await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de paciente realizado com sucesso',
                dados: {
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
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar paciente: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarPaciente(request, response) {
        try {
            const {
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
            } = request.body;

            const { id } = request.params;

            if (!nome || !cpf || !num_prontuario) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome, CPF e número de prontuário são obrigatórios.',
                    dados: null
                });
            }

            if (!/^\d{11}$/.test(String(cpf))) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF deve conter 11 dígitos numéricos.',
                    dados: null
                });
            }

            const [pacienteExistente] = await db.query(
                `
                SELECT pac_id
                FROM Paciente
                WHERE pac_id = ?
                `,
                [id]
            );

            if (pacienteExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Paciente ${id} não encontrado!`,
                    dados: null
                });
            }

            const [cpfDuplicado] = await db.query(
                `
                SELECT pac_id
                FROM Paciente
                WHERE pac_cpf = ?
                  AND pac_id != ?
                `,
                [cpf, id]
            );

            if (cpfDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outro paciente com este CPF.',
                    dados: null
                });
            }

            const [prontuarioDuplicado] = await db.query(
                `
                SELECT pac_id
                FROM Paciente
                WHERE pac_num_prontuario = ?
                  AND pac_id != ?
                `,
                [num_prontuario, id]
            );

            if (prontuarioDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outro paciente com este número de prontuário.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Paciente SET
                    pac_nome = ?,
                    pac_datanasc = ?,
                    pac_cpf = ?,
                    pac_telefone = ?,
                    pac_sexo = ?,
                    pac_num_prontuario = ?,
                    pac_cns = ?,
                    pac_nome_mae = ?,
                    pac_raca = ?,
                    pac_bairro = ?,
                    pac_num_casa = ?,
                    pac_logradouro = ?,
                    pac_cep = ?,
                    pac_uf = ?,
                    pac_municipio = ?,
                    pac_cod_ibge = ?
                WHERE pac_id = ?
            `;

            const values = [
                nome,
                datanasc || null,
                cpf,
                telefone || null,
                sexo ?? null,
                num_prontuario,
                cns || null,
                nome_mae || null,
                raca || null,
                bairro || null,
                num_casa || null,
                logradouro || null,
                cep || null,
                uf || null,
                municipio || null,
                cod_ibge || null,
                id
            ];

            await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Paciente ${id} atualizado com sucesso!`,
                dados: {
                    id: Number(id),
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
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar paciente: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarPaciente(request, response) {
        try {
            const { id } = request.params;

            const [pacienteExistente] = await db.query(
                `
                SELECT pac_id
                FROM Paciente
                WHERE pac_id = ?
                `,
                [id]
            );

            if (pacienteExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Paciente ${id} não encontrado!`,
                    dados: null
                });
            }

            const [atendimentosVinculados] = await db.query(
                `
                SELECT atend_id
                FROM Atendimento
                WHERE pac_id = ?
                `,
                [id]
            );

            if (atendimentosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o paciente porque existem atendimentos vinculados a ele.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Paciente
                WHERE pac_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Paciente ${id} excluído com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar paciente: ${error.message}`,
                dados: error.message
            });
        }
    }
};