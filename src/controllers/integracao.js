const db = require('../dataBase/connection');

function normalizarCpf(cpf) {
    return String(cpf || '').replace(/\D/g, '');
}

function primeiroValor(...valores) {
    return valores.find((valor) => valor !== undefined);
}

async function validarReferencia(connection, tabela, coluna, valor, mensagem) {
    const [rows] = await connection.query(
        `SELECT ${coluna} FROM ${tabela} WHERE ${coluna} = ?`,
        [valor]
    );

    if (rows.length === 0) {
        const error = new Error(mensagem);
        error.status = 400;
        throw error;
    }
}

module.exports = {
    async criarAtendimentoPendente(request, response) {
        const connection = await db.getConnection();

        try {
            const pacienteEntrada = request.body.paciente || request.body;
            const atendimentoEntrada = request.body.atendimento || request.body;

            const paciente = {
                nome: pacienteEntrada.nome,
                datanasc: pacienteEntrada.datanasc,
                cpf: normalizarCpf(pacienteEntrada.cpf),
                telefone: pacienteEntrada.telefone,
                datacadastro: pacienteEntrada.datacadastro,
                sexo: pacienteEntrada.sexo,
                num_prontuario: pacienteEntrada.num_prontuario,
                cns: pacienteEntrada.cns,
                nome_mae: pacienteEntrada.nome_mae,
                raca: pacienteEntrada.raca,
                bairro: pacienteEntrada.bairro,
                num_casa: pacienteEntrada.num_casa,
                logradouro: pacienteEntrada.logradouro,
                cep: pacienteEntrada.cep,
                uf: pacienteEntrada.uf,
                municipio: pacienteEntrada.municipio,
                cod_ibge: pacienteEntrada.cod_ibge
            };

            const atendimento = {
                convenio: atendimentoEntrada.convenio,
                leito: atendimentoEntrada.leito,
                carater: atendimentoEntrada.carater,
                medico: atendimentoEntrada.medico
            };

            if (!paciente.nome || !paciente.cpf || !paciente.num_prontuario) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome, CPF e numero de prontuario do paciente sao obrigatorios.',
                    dados: null
                });
            }

            if (!/^\d{11}$/.test(paciente.cpf)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF deve conter 11 digitos numericos.',
                    dados: null
                });
            }

            if (!atendimento.convenio || !atendimento.leito || !atendimento.carater || !atendimento.medico) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Convenio, leito, carater e medico sao obrigatorios.',
                    dados: null
                });
            }

            await connection.beginTransaction();

            await validarReferencia(connection, 'Convenio', 'con_id', atendimento.convenio, 'Convenio nao encontrado.');
            await validarReferencia(connection, 'Leito', 'leito_id', atendimento.leito, 'Leito nao encontrado.');
            await validarReferencia(connection, 'Carater', 'car_id', atendimento.carater, 'Carater nao encontrado.');
            await validarReferencia(connection, 'Medico', 'med_id', atendimento.medico, 'Medico nao encontrado.');

            const [pacientesEncontrados] = await connection.query(
                `
                SELECT *
                FROM Paciente
                WHERE pac_cpf = ?
                   OR pac_num_prontuario = ?
                `,
                [paciente.cpf, paciente.num_prontuario]
            );

            const idsEncontrados = new Set(pacientesEncontrados.map((item) => item.pac_id));

            if (idsEncontrados.size > 1) {
                const error = new Error('CPF e numero de prontuario pertencem a pacientes diferentes.');
                error.status = 409;
                throw error;
            }

            let pacienteId;
            let pacienteCriado = false;

            if (pacientesEncontrados.length > 0) {
                const pacienteAtual = pacientesEncontrados[0];
                pacienteId = pacienteAtual.pac_id;

                await connection.query(
                    `
                    UPDATE Paciente SET
                        pac_nome = ?,
                        pac_datanasc = ?,
                        pac_cpf = ?,
                        pac_telefone = ?,
                        pac_datacadastro = ?,
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
                    `,
                    [
                        primeiroValor(paciente.nome, pacienteAtual.pac_nome),
                        primeiroValor(paciente.datanasc, pacienteAtual.pac_datanasc),
                        paciente.cpf,
                        primeiroValor(paciente.telefone, pacienteAtual.pac_telefone),
                        primeiroValor(paciente.datacadastro, pacienteAtual.pac_datacadastro),
                        primeiroValor(paciente.sexo, pacienteAtual.pac_sexo),
                        paciente.num_prontuario,
                        primeiroValor(paciente.cns, pacienteAtual.pac_cns),
                        primeiroValor(paciente.nome_mae, pacienteAtual.pac_nome_mae),
                        primeiroValor(paciente.raca, pacienteAtual.pac_raca),
                        primeiroValor(paciente.bairro, pacienteAtual.pac_bairro),
                        primeiroValor(paciente.num_casa, pacienteAtual.pac_num_casa),
                        primeiroValor(paciente.logradouro, pacienteAtual.pac_logradouro),
                        primeiroValor(paciente.cep, pacienteAtual.pac_cep),
                        primeiroValor(paciente.uf, pacienteAtual.pac_uf),
                        primeiroValor(paciente.municipio, pacienteAtual.pac_municipio),
                        primeiroValor(paciente.cod_ibge, pacienteAtual.pac_cod_ibge),
                        pacienteId
                    ]
                );
            } else {
                const [resultPaciente] = await connection.query(
                    `
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
                    `,
                    [
                        paciente.nome,
                        paciente.datanasc || null,
                        paciente.cpf,
                        paciente.telefone || null,
                        paciente.datacadastro || new Date(),
                        paciente.sexo ?? null,
                        paciente.num_prontuario,
                        paciente.cns || null,
                        paciente.nome_mae || null,
                        paciente.raca || null,
                        paciente.bairro || null,
                        paciente.num_casa || null,
                        paciente.logradouro || null,
                        paciente.cep || null,
                        paciente.uf || null,
                        paciente.municipio || null,
                        paciente.cod_ibge || null
                    ]
                );

                pacienteId = resultPaciente.insertId;
                pacienteCriado = true;
            }

            const [resultAtendimento] = await connection.query(
                `
                INSERT INTO Atendimento (
                    pac_id,
                    con_id,
                    leito_id,
                    car_id,
                    med_id,
                    atend_data
                ) VALUES (?, ?, ?, ?, ?, NOW())
                `,
                [
                    pacienteId,
                    atendimento.convenio,
                    atendimento.leito,
                    atendimento.carater,
                    atendimento.medico
                ]
            );

            await connection.commit();

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Atendimento pendente criado com sucesso.',
                dados: {
                    paciente: {
                        id: pacienteId,
                        criado: pacienteCriado
                    },
                    atendimento: {
                        id: resultAtendimento.insertId,
                        convenio: atendimento.convenio,
                        leito: atendimento.leito,
                        carater: atendimento.carater,
                        medico: atendimento.medico
                    }
                }
            });
        } catch (error) {
            await connection.rollback();

            return response.status(error.status || 500).json({
                sucesso: false,
                mensagem: `Erro ao criar atendimento pendente: ${error.message}`,
                dados: error.message
            });
        } finally {
            connection.release();
        }
    }
};
