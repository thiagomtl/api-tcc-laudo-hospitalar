const db = require('../dataBase/connection');
const { criarNotificacao } = require('../utils/notificacoes');
const normalizarTextoLaudo = require('../utils/normalizarTextoLaudo');

function normalizarCpf(cpf) {
    return String(cpf || '').replace(/\D/g, '');
}

function primeiroValor(...valores) {
    return valores.find((valor) => valor !== undefined && valor !== null);
}

function camposAusentes(objeto, campos) {
    return campos.filter((campo) => objeto[campo] === undefined || objeto[campo] === null || objeto[campo] === '');
}

function normalizarNomeMedico(nome) {
    return normalizarTextoLaudo(nome)
        .replace(/\b(DR|DRA|DRS|DRAS|DOUTOR|DOUTORA|MEDICO|MEDICA)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function valorCampo(objeto, ...campos) {
    if (!objeto || typeof objeto !== 'object') {
        return undefined;
    }

    return primeiroValor(...campos.map((campo) => objeto[campo]));
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

async function buscarMedicoPorNome(connection, nomeMedico) {
    const nomeNormalizado = normalizarNomeMedico(nomeMedico);

    const [medicos] = await connection.query(
        `
        SELECT
            med.usu_id,
            med.med_crm,
            u.usu_nome
        FROM Medico med
        INNER JOIN Usuario u
            ON med.usu_id = u.usu_id
        WHERE u.usu_tipo IN ('Medico', 'Médico')
          AND u.usu_status = 1
        `
    );

    return medicos.find((medico) => normalizarNomeMedico(medico.usu_nome) === nomeNormalizado);
}

async function resolverMedico(connection, medicoEntrada) {
    const medico = typeof medicoEntrada === 'object'
        ? primeiroValor(
            medicoEntrada.usu_id,
            medicoEntrada.id,
            medicoEntrada.nome,
            medicoEntrada.nome_medico,
            medicoEntrada.medico_nome,
            medicoEntrada.med_nome
        )
        : medicoEntrada;

    const medicoNormalizado = String(medico || '').trim();

    if (/^\d+$/.test(medicoNormalizado)) {
        const [rows] = await connection.query(
            `
            SELECT usu_id
            FROM Medico
            WHERE usu_id = ?
            `,
            [Number(medicoNormalizado)]
        );

        if (rows.length === 0) {
            const error = new Error('Medico nao encontrado.');
            error.status = 400;
            throw error;
        }

        return {
            id: Number(medicoNormalizado),
            nome: null
        };
    }

    const medicoEncontrado = await buscarMedicoPorNome(connection, medicoNormalizado);

    if (!medicoEncontrado) {
        const error = new Error('Medico nao encontrado pelo nome informado.');
        error.status = 400;
        throw error;
    }

    return {
        id: medicoEncontrado.usu_id,
        nome: medicoEncontrado.usu_nome
    };
}

module.exports = {
    async criarAtendimentoPendente(request, response) {
        const connection = await db.getConnection();

        try {
            const pacienteEntrada = request.body.paciente || request.body;
            const atendimentoEntrada = request.body.atendimento || request.body;

            const paciente = {
                nome: normalizarTextoLaudo(pacienteEntrada.nome),
                datanasc: pacienteEntrada.datanasc,
                cpf: normalizarCpf(pacienteEntrada.cpf),
                telefone: pacienteEntrada.telefone,
                datacadastro: pacienteEntrada.datacadastro,
                sexo: pacienteEntrada.sexo,
                num_prontuario: pacienteEntrada.num_prontuario,
                cns: pacienteEntrada.cns,
                nome_mae: normalizarTextoLaudo(pacienteEntrada.nome_mae),
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
                medico: primeiroValor(
                    atendimentoEntrada.medico,
                    atendimentoEntrada.nome_medico,
                    atendimentoEntrada.medico_nome,
                    atendimentoEntrada.med_nome,
                    valorCampo(atendimentoEntrada.medico, 'usu_id', 'id', 'nome', 'nome_medico', 'medico_nome', 'med_nome')
                )
            };

            const camposObrigatoriosPaciente = [
                'nome',
                'datanasc',
                'cpf',
                'telefone',
                'sexo',
                'num_prontuario',
                'cns',
                'nome_mae',
                'raca',
                'bairro',
                'num_casa',
                'logradouro',
                'cep',
                'uf',
                'municipio',
                'cod_ibge'
            ];
            const camposPacienteAusentes = camposAusentes(paciente, camposObrigatoriosPaciente);

            if (camposPacienteAusentes.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `Campos obrigatorios do paciente ausentes: ${camposPacienteAusentes.join(', ')}.`,
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

            const camposAtendimentoAusentes = camposAusentes(atendimento, ['convenio', 'leito', 'carater', 'medico']);

            if (camposAtendimentoAusentes.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `Campos obrigatorios do atendimento ausentes: ${camposAtendimentoAusentes.join(', ')}.`,
                    dados: null
                });
            }

            await connection.beginTransaction();

            await validarReferencia(connection, 'Convenio', 'con_id', atendimento.convenio, 'Convenio nao encontrado.');
            await validarReferencia(connection, 'Leito', 'leito_id', atendimento.leito, 'Leito nao encontrado.');
            await validarReferencia(connection, 'Carater', 'car_id', atendimento.carater, 'Carater nao encontrado.');

            const medicoResolvido = await resolverMedico(connection, atendimento.medico);

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
                    usu_id,
                    atend_data
                ) VALUES (?, ?, ?, ?, ?, NOW())
                `,
                [
                    pacienteId,
                    atendimento.convenio,
                    atendimento.leito,
                    atendimento.carater,
                    medicoResolvido.id
                ]
            );

            await connection.commit();

            const notificacao = criarNotificacao({
                tipo: 'ATENDIMENTO_PENDENTE',
                titulo: 'Novo paciente recebido',
                mensagem: `${paciente.nome} chegou em laudos pendentes.`,
                dados: {
                    paciente: {
                        id: pacienteId,
                        nome: paciente.nome,
                        cpf: paciente.cpf,
                        num_prontuario: paciente.num_prontuario,
                        criado: pacienteCriado
                    },
                    atendimento: {
                        id: resultAtendimento.insertId,
                        convenio: atendimento.convenio,
                        leito: atendimento.leito,
                        carater: atendimento.carater,
                        medico: medicoResolvido.id,
                        medico_nome: medicoResolvido.nome || atendimento.medico
                    }
                }
            });

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
                        medico: medicoResolvido.id,
                        medico_nome: medicoResolvido.nome || atendimento.medico
                    },
                    notificacao
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
