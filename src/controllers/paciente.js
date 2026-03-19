const db = require('../dataBase/connection');

// Função auxiliar para validações
function validarPaciente(dados) {
    const erros = [];
    
    // Campos obrigatórios
    const camposObrigatorios = ['pac_nome', 'pac_datanasc', 'pac_cpf', 'pac_telefone', 'pac_sexo', 'pac_num_prontuario', 'pac_cns', 'pac_nome_mae', 'pac_raca', 'pac_bairro', 'pac_num_casa', 'pac_logradouro', 'pac_cep', 'pac_uf', 'pac_municipio', 'pac_cod_ibge'];
    camposObrigatorios.forEach(campo => {
        if (!dados[campo]) {
            erros.push(`${campo} é obrigatório`);
        }
    });
    
    // Validações de formato
    if (dados.pac_cpf && !/^\d{11}$/.test(dados.pac_cpf)) {
        erros.push('CPF deve ter 11 dígitos numéricos');
    }
    if (dados.pac_cns && !/^\d{15}$/.test(dados.pac_cns)) {
        erros.push('CNS deve ter 15 dígitos numéricos');
    }
    if (dados.pac_cep && !/^\d{8}$/.test(dados.pac_cep)) {
        erros.push('CEP deve ter 8 dígitos numéricos');
    }
    if (dados.pac_uf && !/^[A-Z]{2}$/.test(dados.pac_uf)) {
        erros.push('UF deve ter 2 letras maiúsculas');
    }
    if (dados.pac_sexo !== undefined && ![0, 1].includes(dados.pac_sexo)) {
        erros.push('Sexo deve ser 0 ou 1');
    }
    // Validar data de nascimento (simples)
    if (dados.pac_datanasc && isNaN(Date.parse(dados.pac_datanasc))) {
        erros.push('Data de nascimento inválida');
    }
    
    return erros;
}

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
                    mensagem: `Erro ao obter lista de pacientes: ${error.message}`
                }
            );
        }
    },

    async cadastrarPaciente(request, response) {
        try {
            const dados = request.body;
            
            // Validações
            const erros = validarPaciente(dados);
            if (erros.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Erros de validação',
                    erros: erros
                });
            }
            
            // Verificar unicidade do CPF
            const [cpfExistente] = await db.query('SELECT pac_id FROM Paciente WHERE pac_cpf = ?', [dados.pac_cpf]);
            if (cpfExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF já cadastrado'
                });
            }
            
            const sql = `
                INSERT INTO Paciente (pac_nome, pac_datanasc, pac_cpf, pac_telefone, pac_datacadastro, pac_sexo, pac_num_prontuario, pac_cns, 
                pac_nome_mae, pac_raca, pac_bairro, pac_num_casa, pac_logradouro, pac_cep, pac_uf, pac_municipio, pac_cod_ibge) 
                VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const valores = [dados.pac_nome, dados.pac_datanasc, dados.pac_cpf, dados.pac_telefone, dados.pac_sexo, dados.pac_num_prontuario, dados.pac_cns, 
                dados.pac_nome_mae, dados.pac_raca, dados.pac_bairro, dados.pac_num_casa, dados.pac_logradouro, dados.pac_cep, dados.pac_uf, dados.pac_municipio, dados.pac_cod_ibge];
            
            await db.query(sql, valores);

            return response.status(201).json(
                {
                    sucesso: true,
                    mensagem: `Cadastro de paciente realizado com sucesso`
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar paciente: ${error.message}`
                }
            );
        }
    },

    async editarPaciente(request, response) {
        try {
            const { id } = request.params;
            const dados = request.body;
            
            // Verificar se paciente existe
            const [pacienteExistente] = await db.query('SELECT pac_id FROM Paciente WHERE pac_id = ?', [id]);
            if (pacienteExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Paciente não encontrado'
                });
            }
            
            // Validações
            const erros = validarPaciente(dados);
            if (erros.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Erros de validação',
                    erros: erros
                });
            }
            
            // Verificar unicidade do CPF se mudou
            if (dados.pac_cpf !== pacienteExistente[0].pac_cpf) {
                const [cpfExistente] = await db.query('SELECT pac_id FROM Paciente WHERE pac_cpf = ? AND pac_id != ?', [dados.pac_cpf, id]);
                if (cpfExistente.length > 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'CPF já cadastrado para outro paciente'
                    });
                }
            }
            
            const sql = `
                UPDATE Paciente SET pac_nome = ?, pac_datanasc = ?, pac_cpf = ?, pac_telefone = ?, pac_sexo = ?, pac_num_prontuario = ?, pac_cns = ?, 
                pac_nome_mae = ?, pac_raca = ?, pac_bairro = ?, pac_num_casa = ?, pac_logradouro = ?, pac_cep = ?, pac_uf = ?, pac_municipio = ?, pac_cod_ibge = ? 
                WHERE pac_id = ?
            `;
            const valores = [dados.pac_nome, dados.pac_datanasc, dados.pac_cpf, dados.pac_telefone, dados.pac_sexo, dados.pac_num_prontuario, dados.pac_cns, 
                dados.pac_nome_mae, dados.pac_raca, dados.pac_bairro, dados.pac_num_casa, dados.pac_logradouro, dados.pac_cep, dados.pac_uf, dados.pac_municipio, dados.pac_cod_ibge, id];
            
            await db.query(sql, valores);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Atualização de paciente realizada com sucesso`
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar paciente: ${error.message}`
                }
            );
        }
    },

    async apagarPaciente(request, response) {
        try {
            const { id } = request.params;
            
            // Verificar se paciente existe
            const [pacienteExistente] = await db.query('SELECT pac_id FROM Paciente WHERE pac_id = ?', [id]);
            if (pacienteExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Paciente não encontrado'
                });
            }
            
            // Verificar se há atendimentos relacionados (opcional, dependendo das regras de negócio)
            const [atendimentos] = await db.query('SELECT atend_id FROM Atendimento WHERE pac_id = ?', [id]);
            if (atendimentos.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir paciente com atendimentos registrados'
                });
            }
            
            const sql = `DELETE FROM Paciente WHERE pac_id = ?`;
            await db.query(sql, [id]);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Paciente apagado com sucesso`
                }
            );
        }
        catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar paciente: ${error.message}`
                }
            );
        }
    },
}