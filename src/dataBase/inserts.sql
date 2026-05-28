/* Seed limpo para testes de laudo */
USE bd_tcc_laudos;

/* Tabela Convenio */
INSERT INTO Convenio (con_tipo) VALUES
('SUS'),
('Unimed'),
('Particular'),
('Bradesco Saude'),
('SulAmerica');

/* Tabela Setor */
INSERT INTO Setor (set_nome) VALUES
('UTI A'),
('UTI B'),
('Pediatria'),
('Clinica Medica'),
('Ortopedia');

/* Tabela Leito */
INSERT INTO Leito (set_id, leito_identificacao) VALUES
(1, 'UTI-A-01'),
(1, 'UTI-A-02'),
(2, 'UTI-B-01'),
(2, 'UTI-B-02'),
(3, 'PED-01'),
(3, 'PED-02'),
(4, 'CM-01'),
(4, 'CM-02'),
(5, 'ORT-01'),
(5, 'ORT-02');

/* Tabela Carater */
INSERT INTO Carater (car_tipo) VALUES
('Urgencia'),
('Eletivo'),
('Internacao');

/* Tabela Instituicao */
INSERT INTO Instituicao (inst_nome, inst_razao_social, inst_cnes, inst_cnpj) VALUES
('Hospital MedSync', 'Hospital MedSync LTDA', '1234567', '12345678000199');

/* Tabela Usuario */
INSERT INTO Usuario (
    usu_nome, usu_usuario, usu_documento, usu_email, usu_senha, usu_datacriacao,
    inst_id, usu_telefone, usu_foto, usu_biometria, usu_tipo, usu_status
) VALUES
('Ana Almeida', 'ana.ad', '10000000001', 'adm@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:00:00', 1, '14990000001', NULL, NULL, 'Administrador', 1),
('Bruno Costa', 'bruno.fat', '10000000002', 'fat@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:05:00', 1, '14990000002', NULL, NULL, 'Faturista', 1),
('Carla Dias', 'carla.med', '10000000003', 'med@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:10:00', 1, '14990000003', NULL, NULL, 'Medico', 1),
('Luis Administrador', 'luis.ad', '10000000004', 'luis.ad@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:15:00', 1, '14990000004', NULL, NULL, 'Administrador', 1),
('Luis Faturista', 'luis.fat', '10000000005', 'luis.fat@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:20:00', 1, '14990000005', NULL, NULL, 'Faturista', 1),
('Luis Medico', 'luis.med', '10000000006', 'luis.med@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:25:00', 1, '14990000006', NULL, NULL, 'Medico', 1),
('Joao Administrador', 'joao.ad', '10000000007', 'joao.ad@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:30:00', 1, '14990000007', NULL, NULL, 'Administrador', 1),
('Joao Faturista', 'joao.fat', '10000000008', 'joao.fat@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:35:00', 1, '14990000008', NULL, NULL, 'Faturista', 1),
('Joao Medico', 'joao.med', '10000000009', 'joao.med@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:40:00', 1, '14990000009', NULL, NULL, 'Medico', 1),
('Thiago Administrador', 'thiago.ad', '10000000010', 'thiago.ad@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:45:00', 1, '14990000010', NULL, NULL, 'Administrador', 1),
('Thiago Faturista', 'thiago.fat', '10000000011', 'thiago.fat@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:50:00', 1, '14990000011', NULL, NULL, 'Faturista', 1),
('Thiago Medico', 'thiago.med', '10000000012', 'thiago.med@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:55:00', 1, '14990000012', NULL, NULL, 'Medico', 1),
('Luiz Administrador', 'luiz.ad', '10000000013', 'luiz.ad@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 09:00:00', 1, '14990000013', NULL, NULL, 'Administrador', 1),
('Luiz Faturista', 'luiz.fat', '10000000014', 'luiz.fat@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 09:05:00', 1, '14990000014', NULL, NULL, 'Faturista', 1),
('Luiz Medico', 'luiz.med', '10000000015', 'luiz.med@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 09:10:00', 1, '14990000015', NULL, NULL, 'Medico', 1);

/* Tabela Medico: os dados pessoais ficam em Usuario; aqui fica apenas o CRM */
INSERT INTO Medico (usu_id, med_crm) VALUES
(3, '100003'),
(6, '900006'),
(9, '900009'),
(12, '900012'),
(15, '900015');

/* Tabela Paciente */
INSERT INTO Paciente (
    pac_nome, pac_datanasc, pac_cpf, pac_telefone, pac_datacadastro,
    pac_sexo, pac_num_prontuario, pac_cns, pac_nome_mae, pac_raca,
    pac_bairro, pac_num_casa, pac_logradouro, pac_cep, pac_uf,
    pac_municipio, pac_cod_ibge
) VALUES
('Maria Oliveira', '1995-08-20', '90000000001', '14991000001', '2026-05-20 09:00:00', 0, 2001, '700000000000001', 'Regina Oliveira', 'Branca', 'Centro', '101', 'Rua das Flores', '17600000', 'SP', 'Tupa', 3555002),
('Lucas Ferreira', '1988-05-10', '90000000002', '14991000002', '2026-05-20 09:05:00', 1, 2002, '700000000000002', 'Maria Ferreira', 'Branca', 'Centro', '120', 'Rua A', '17600001', 'SP', 'Tupa', 3555002),
('Amanda Souza', '1995-08-15', '90000000003', '14991000003', '2026-05-20 09:10:00', 0, 2003, '700000000000003', 'Carla Souza', 'Parda', 'Vila Nova', '85', 'Rua B', '17600001', 'SP', 'Tupa', 3555002),
('Pedro Henrique', '1989-03-22', '90000000004', '14991000004', '2026-05-20 09:15:00', 1, 2004, '700000000000004', 'Ana Henrique', 'Branca', 'Jardim America', '45', 'Rua C', '17600002', 'SP', 'Tupa', 3555002),
('Juliana Lima', '2000-11-30', '90000000005', '14991000005', '2026-05-20 09:20:00', 0, 2005, '700000000000005', 'Patricia Lima', 'Preta', 'Centro', '210', 'Rua D', '17600003', 'SP', 'Tupa', 3555002),
('Roberto Alves', '1978-07-19', '90000000006', '14991000006', '2026-05-20 09:25:00', 1, 2006, '700000000000006', 'Sandra Alves', 'Parda', 'Industrial', '77', 'Rua E', '17600004', 'SP', 'Tupa', 3555002),
('Ana Clara Santos', '1997-02-14', '90000000007', '14991000007', '2026-05-20 09:30:00', 0, 2007, '700000000000007', 'Marcia Santos', 'Branca', 'Centro', '101', 'Rua das Flores', '17600000', 'SP', 'Tupa', 3555002),
('Bruno Carvalho', '1988-06-21', '90000000008', '14991000008', '2026-05-20 09:35:00', 1, 2008, '700000000000008', 'Helena Carvalho', 'Parda', 'Vila Abarca', '102', 'Rua Sao Paulo', '17600001', 'SP', 'Tupa', 3555002),
('Camila Rocha', '1992-09-03', '90000000009', '14991000009', '2026-05-20 09:40:00', 0, 2009, '700000000000009', 'Regina Rocha', 'Branca', 'Jardim America', '103', 'Rua Rio Branco', '17600002', 'SP', 'Tupa', 3555002),
('Marcos Pereira', '1983-12-09', '90000000010', '14991000010', '2026-05-20 09:45:00', 1, 2010, '700000000000010', 'Neusa Pereira', 'Parda', 'Centro', '104', 'Rua Brasil', '17600005', 'SP', 'Tupa', 3555002),
('Beatriz Nunes', '1991-01-18', '90000000011', '14991000011', '2026-05-20 09:50:00', 0, 2011, '700000000000011', 'Helena Nunes', 'Branca', 'Centro', '105', 'Rua Brasil', '17600005', 'SP', 'Tupa', 3555002),
('Daniel Moraes', '1984-04-27', '90000000012', '14991000012', '2026-05-20 09:55:00', 1, 2012, '700000000000012', 'Fatima Moraes', 'Parda', 'Jardim Europa', '56', 'Rua Europa', '17600006', 'SP', 'Tupa', 3555002),
('Renata Farias', '1999-10-11', '90000000013', '14991000013', '2026-05-20 10:00:00', 0, 2013, '700000000000013', 'Silvia Farias', 'Preta', 'Vila Nova', '78', 'Rua Nova', '17600007', 'SP', 'Tupa', 3555002),
('Gustavo Reis', '1975-12-05', '90000000014', '14991000014', '2026-05-20 10:05:00', 1, 2014, '700000000000014', 'Marcia Reis', 'Branca', 'Centro', '109', 'Rua Para', '17600008', 'SP', 'Tupa', 3555002),
('Sofia Martins', '2002-03-09', '90000000015', '14991000015', '2026-05-20 10:10:00', 0, 2015, '700000000000015', 'Eliane Martins', 'Parda', 'Vila Abarca', '92', 'Rua Minas', '17600009', 'SP', 'Tupa', 3555002),
('Rafael Gomes', '1980-06-16', '90000000016', '14991000016', '2026-05-20 10:15:00', 1, 2016, '700000000000016', 'Neide Gomes', 'Branca', 'Industrial', '43', 'Rua Bahia', '17600010', 'SP', 'Tupa', 3555002),
('Laura Castro', '1993-07-24', '90000000017', '14991000017', '2026-05-20 10:20:00', 0, 2017, '700000000000017', 'Sonia Castro', 'Parda', 'Centro', '132', 'Rua Ceara', '17600011', 'SP', 'Tupa', 3555002),
('Eduardo Silva', '1986-09-13', '90000000018', '14991000018', '2026-05-20 10:25:00', 1, 2018, '700000000000018', 'Luzia Silva', 'Preta', 'Jardim America', '67', 'Rua Goias', '17600012', 'SP', 'Tupa', 3555002),
('Patricia Araujo', '1996-02-03', '90000000019', '14991000019', '2026-05-20 10:30:00', 0, 2019, '700000000000019', 'Marta Araujo', 'Branca', 'Vila Nova', '88', 'Rua Acre', '17600013', 'SP', 'Tupa', 3555002),
('Felipe Barbosa', '1979-11-29', '90000000020', '14991000020', '2026-05-20 10:35:00', 1, 2020, '700000000000020', 'Ivone Barbosa', 'Parda', 'Centro', '144', 'Rua Mato Grosso', '17600014', 'SP', 'Tupa', 3555002);

/* Tabela Atendimento: 20 atendimentos da Carla Dias (med_id = 1) */
INSERT INTO Atendimento (pac_id, con_id, leito_id, car_id, med_id, atend_data) VALUES
(1, 1, 1, 1, 1, '2026-05-20 11:00:00'),
(2, 2, 2, 2, 1, '2026-05-20 11:05:00'),
(3, 3, 3, 3, 1, '2026-05-20 11:10:00'),
(4, 4, 4, 1, 1, '2026-05-20 11:15:00'),
(5, 5, 5, 2, 1, '2026-05-20 11:20:00'),
(6, 1, 6, 3, 1, '2026-05-20 11:25:00'),
(7, 2, 7, 1, 1, '2026-05-20 11:30:00'),
(8, 3, 8, 2, 1, '2026-05-20 11:35:00'),
(9, 4, 9, 3, 1, '2026-05-20 11:40:00'),
(10, 5, 10, 1, 1, '2026-05-20 11:45:00'),
(11, 1, 1, 2, 1, '2026-05-20 11:50:00'),
(12, 2, 2, 3, 1, '2026-05-20 11:55:00'),
(13, 3, 3, 1, 1, '2026-05-20 12:00:00'),
(14, 4, 4, 2, 1, '2026-05-20 12:05:00'),
(15, 5, 5, 3, 1, '2026-05-20 12:10:00'),
(16, 1, 6, 1, 1, '2026-05-20 12:15:00'),
(17, 2, 7, 2, 1, '2026-05-20 12:20:00'),
(18, 3, 8, 3, 1, '2026-05-20 12:25:00'),
(19, 4, 9, 1, 1, '2026-05-20 12:30:00'),
(20, 5, 10, 2, 1, '2026-05-20 12:35:00');

/* Tabela Escolha_Clinica */
INSERT INTO Escolha_Clinica (cli_descricao) VALUES
('Medica'),
('Cirurgica'),
('Pediatrica'),
('Obstetrica'),
('Ortopedica');

/* Tabela Procedimento */
INSERT INTO Procedimento (pro_codigo, pro_descricao) VALUES
(301010072, 'Consulta medica'),
(403010012, 'Eletrocardiograma'),
(202010058, 'Hemograma completo'),
(205020046, 'Raio X torax'),
(407030016, 'Ultrassonografia'),
(403020026, 'Ecocardiograma'),
(408010013, 'Tomografia'),
(409010030, 'Ressonancia'),
(412010054, 'Endoscopia'),
(401020010, 'Curativo especial');

/* Tabela CID */
INSERT INTO CID (cid_codigo, cid_descricao) VALUES
('R50', 'Febre'),
('R10', 'Dor abdominal'),
('J18', 'Pneumonia'),
('I10', 'Hipertensao'),
('E11', 'Diabetes tipo 2'),
('S72', 'Fratura femur'),
('N39', 'Infeccao urinaria'),
('M54', 'Dor lombar'),
('K35', 'Apendicite'),
('Z00', 'Exame geral');

/* Tabela Procedimento_Cids */
INSERT INTO Procedimento_Cids (pro_id, cid_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

/* Tabela Laudo: 1 concluido para a Carla. Os outros 19 atendimentos ficam pendentes sem linha em Laudo. */
INSERT INTO Laudo (
    atend_id, cli_id, cid_id, pro_id, lau_sinais, lau_internacao,
    lau_resultado, lau_recurso, lau_datapreenc, lau_status
) VALUES
(1, 1, 1, 1, 'Febre e mal-estar', 'Observacao clinica', 'Paciente estavel', 'Medicar e observar', '2026-05-20 13:00:00', 1);

/* Tabela Favorito */
INSERT INTO Favorito (lau_id, med_id, fav_nome) VALUES
(1, 1, 'Febre');
