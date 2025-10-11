-- Inserts para popular as tabelas do banco
-- Tabela Paciente
INSERT INTO Paciente (pac_nome, pac_datanasc, pac_cpf, pac_telefone, pac_datacadastro, pac_sexo, pac_num_prontuario, pac_cns, pac_nome_mae, pac_raca, pac_bairro, pac_num_casa, pac_logradouro, pac_cep, pac_uf, pac_municipio, pac_cod_ibge) VALUES
('João Silva', '1980-05-12', '12345678901', '11999999999', '2025-10-10 08:00:00', 1, 1001, '123456789012345', 'Maria Silva', 'Branca', 'Centro', '123', 'Rua das Flores', '01001000', 'SP', 'São Paulo', 3550308),
('Ana Souza', '1992-11-23', '23456789012', '21988888888', '2025-10-10 08:05:00', 0, 1002, '234567890123456', 'Clara Souza', 'Parda', 'Copacabana', '456', 'Avenida Atlântica', '22041001', 'RJ', 'Rio de Janeiro', 3304557),
('Carlos Pereira', '1975-03-30', '34567890123', '31977777777', '2025-10-10 08:10:00', 1, 1003, '345678901234567', 'Helena Pereira', 'Negra', 'Savassi', '789', 'Rua da Paz', '30140110', 'MG', 'Belo Horizonte', 3106200),
('Beatriz Lima', '1988-07-15', '45678901234', '41966666666', '2025-10-10 08:15:00', 0, 1004, '456789012345678', 'Juliana Lima', 'Amarela', 'Batel', '321', 'Rua Curitiba', '80240000', 'PR', 'Curitiba', 4106902),
('Pedro Alves', '2000-01-01', '56789012345', '51955555555', '2025-10-10 08:20:00', 1, 1005, '567890123456789', 'Sandra Alves', 'Indígena', 'Moinhos', '654', 'Rua dos Andradas', '90020000', 'RS', 'Porto Alegre', 4314902),
('Marina Costa', '1995-09-09', '67890123456', '61944444444', '2025-10-10 08:25:00', 0, 1006, '678901234567890', 'Patrícia Costa', 'Branca', 'Asa Sul', '987', 'SQN 308', '70350510', 'DF', 'Brasília', 5300108);

-- Tabela Convenio
INSERT INTO Convenio (con_tipo) VALUES
('SUS'),
('Unimed'),
('IAMSPE'),
('Bradesco Saúde'),
('SulAmérica'),
('Santa Casa Saúde');

-- Tabela Setor
INSERT INTO Setor (set_nome) VALUES
('Emergência'),
('UTI Adulto'),
('UTI Pediátrica'),
('Internação Clínica'),
('Internação Cirúrgica'),
('Observação');

-- Tabela Leito
INSERT INTO Leito (set_id, leito_identificacao) VALUES
(1, 'E01'),
(2, 'U01'),
(3, 'UP01'),
(4, 'IC01'),
(5, 'ICG01'),
(6, 'O01');

-- Tabela Carater
INSERT INTO Carater (car_tipo) VALUES
('Eletivo'),
('Urgência');

-- Tabela Instituicao
INSERT INTO Instituicao (inst_nome, inst_razao_social, inst_cnes, inst_cnpj) VALUES
('Hospital Central', 'Hospital Central S.A.', '1234567', '12345678000199'),
('Clínica Vida', 'Clínica Vida Ltda.', '2345678', '23456789000188'),
('Santa Casa', 'Santa Casa de Misericórdia', '3456789', '34567890000177'),
('Hospital Infantil', 'Hospital Infantil S.A.', '4567890', '45678900000166'),
('Hospital Regional', 'Hospital Regional Ltda.', '5678901', '56789010000155'),
('Clínica Saúde', 'Clínica Saúde Ltda.', '6789012', '67890120000144');

-- Tabela Usuario
INSERT INTO Usuario (usu_nome, usu_documento, usu_email, usu_senha, usu_datacriacao, inst_id, usu_telefone, usu_foto, usu_biometria, usu_tipo, usu_status) VALUES
('Paulo Mendes', '123456789', 'paulo@hospital.com', 'senha123', '2025-10-10 09:00:00', 1, '11999999999', NULL, NULL, 'Médico', 1),
('Carla Dias', '987654321', 'carla@hospital.com', 'senha456', '2025-10-10 09:05:00', 2, '21988888888', NULL, NULL, 'Médico', 1),
('Lucas Rocha', '456789123', 'lucas@hospital.com', 'senha789', '2025-10-10 09:10:00', 3, '31977777777', NULL, NULL, 'Administrador', 1),
('Fernanda Alves', '789123456', 'fernanda@hospital.com', 'senha321', '2025-10-10 09:15:00', 4, '41966666666', NULL, NULL, 'Médico', 1),
('João Lima', '321654987', 'joao@hospital.com', 'senha654', '2025-10-10 09:20:00', 5, '51955555555', NULL, NULL, 'Faturista', 1),
('Marina Costa', '654987321', 'marina@hospital.com', 'senha987', '2025-10-10 09:25:00', 6, '61944444444', NULL, NULL, 'Médico', 1);

-- Tabela Medico
INSERT INTO Medico (med_crm) VALUES
('1234567'),
('2345678'),
('3456789'),
('4567890'),
('5678901'),
('6789012');

-- Tabela Atendimento
INSERT INTO Atendimento (pac_id, con_id, leito_id, car_id, med_id, atend_data) VALUES
(1, 1, 1, 1, 1, '2025-10-10 10:00:00'),
(2, 2, 2, 2, 2, '2025-10-10 10:10:00'),
(3, 3, 3, 3, 3, '2025-10-10 10:20:00'),
(4, 4, 4, 4, 4, '2025-10-10 10:30:00'),
(5, 5, 5, 5, 5, '2025-10-10 10:40:00'),
(6, 6, 6, 6, 6, '2025-10-10 10:50:00');

-- Tabela Logs_Acao
INSERT INTO Logs_Acao (usu_id, log_acao, log_detalhe, log_datahora) VALUES
(1, 'Login', 'Acesso ao sistema', '2025-10-10 11:00:00'),
(2, 'Cadastro Paciente', 'Paciente inserido', '2025-10-10 11:05:00'),
(3, 'Alteração Prontuário', 'Prontuário alterado', '2025-10-10 11:10:00'),
(4, 'Saída do sistema', 'Logout', '2025-10-10 11:15:00'),
(5, 'Cadastro Atendimento', 'Atendimento inserido', '2025-10-10 11:20:00'),
(6, 'Cadastro Médico', 'Médico inserido', '2025-10-10 11:25:00');

-- Tabela Mensagem_Chat
INSERT INTO Mensagem_Chat (usu_id_remetente, usu_id_destinatario, msg_conteudo, msg_arqanexo, msg_datahoraenvio, msg_status, msg_resposta) VALUES
(1, 2, 'Olá, Carla!', NULL, '2025-10-10 12:00:00', 'Enviada', NULL),
(2, 1, 'Oi, Paulo!', NULL, '2025-10-10 12:05:00', 'Lida', 1),
(3, 4, 'Fernanda, reunião às 14h.', NULL, '2025-10-10 12:10:00', 'Enviada', NULL),
(4, 3, 'Ok, Lucas!', NULL, '2025-10-10 12:15:00', 'Lida', 3),
(5, 6, 'Marina, paciente novo.', NULL, '2025-10-10 12:20:00', 'Enviada', NULL),
(6, 5, 'Recebido, João.', NULL, '2025-10-10 12:25:00', 'Lida', 5);

-- Tabela Escolha_Clinica
INSERT INTO Escolha_Clinica (cli_descricao) VALUES
('Cardiologia'),
('Pediatria'),
('Ortopedia'),
('Neurologia'),
('Oncologia'),
('Ginecologia');

-- Tabela Procedimento
INSERT INTO Procedimento (pro_codigo, pro_descricao) VALUES
(101, 'Eletrocardiograma'),
(102, 'Raio-X'),
(103, 'Tomografia'),
(104, 'Ultrassom'),
(105, 'Biópsia'),
(106, 'Hemograma');

-- Tabela CID
INSERT INTO CID (cid_codigo, cid_descricao) VALUES
('A00', 'Cólera'),
('B01', 'Varicela'),
('C02', 'Neoplasia Maligna'),
('D03', 'Melanoma'),
('E04', 'Doenças da tireoide'),
('F05', 'Delírio não induzido por álcool');

-- Tabela Procedimento_Cids
INSERT INTO Procedimento_Cids (pro_id, cid_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6);

-- Tabela Laudo
INSERT INTO Laudo (atend_id, cli_id, proc_cid_id, lau_sinais, lau_internacao, lau_resultado, lau_recurso, lau_datapreenc, lau_status) VALUES
(1, 1, 1, 'Dor no peito', 'Internado', 'ECG alterado', 'Solicitado cateterismo', '2025-10-10 13:00:00', 1),
(2, 2, 2, 'Febre alta', 'Internado', 'Varicela confirmada', 'Isolamento', '2025-10-10 13:10:00', 1),
(3, 3, 3, 'Massa tumoral', 'Internado', 'Neoplasia detectada', 'Encaminhado para oncologia', '2025-10-10 13:20:00', 1),
(4, 4, 4, 'Lesão pigmentada', 'Internado', 'Melanoma confirmado', 'Cirurgia agendada', '2025-10-10 13:30:00', 1),
(5, 5, 5, 'Nódulo tireoidiano', 'Internado', 'Doença tireoidiana', 'Tratamento clínico', '2025-10-10 13:40:00', 1),
(6, 6, 6, 'Confusão mental', 'Internado', 'Delírio diagnosticado', 'Avaliação psiquiátrica', '2025-10-10 13:50:00', 1);

-- Tabela Favorito
INSERT INTO Favorito (lau_id, med_id, fav_nome) VALUES
(1, 1, 'Laudo João'),
(2, 2, 'Laudo Ana'),
(3, 3, 'Laudo Carlos'),
(4, 4, 'Laudo Beatriz'),
(5, 5, 'Laudo Pedro'),
(6, 6, 'Laudo Marina');
