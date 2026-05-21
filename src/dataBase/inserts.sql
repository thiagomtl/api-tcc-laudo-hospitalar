/* Inserts para popular as tabelas com 10 registros cada */
USE bd_tcc_laudos;

/* Tabela Convenio */
INSERT INTO Convenio (con_tipo) VALUES
('SUS'),
('Unimed'),
('Particular'),
('Bradesco Saude'),
('SulAmerica'),
('NotreDame'),
('Amil'),
('Porto Saude'),
('Hapvida'),
('Cassi');

/* Tabela Setor */
INSERT INTO Setor (set_nome) VALUES
('UTI A'),
('UTI B'),
('UTI C'),
('Pediatria'),
('Maternidade'),
('Ala Cirúrgica SUS'),
('Ala Cirúrgica Mista'),
('Ala SUS/Feminino'),
('Ala SUS/Masculino'),
('Ala Convênios');

/* Tabela Leito */
INSERT INTO Leito (set_id, leito_identificacao) VALUES
(1, '1'),
(2, '2'),
(3, '3'),
(4, '4'),
(5, '5'),
(6, '6'),
(7, '7'),
(8, '8'),
(9, '9'),
(10, '10');

/* Tabela Carater */
INSERT INTO Carater (car_tipo) VALUES
('Urgencia'),
('Eletivo'),
('Urgencia'),
('Eletivo'),
('Urgencia'),
('Eletivo'),
('Urgencia'),
('Eletivo'),
('Urgencia'),
('Eletivo');


/* Tabela Instituicao */
INSERT INTO Instituicao (inst_nome, inst_razao_social, inst_cnes, inst_cnpj) VALUES
('Hospital MedSync', 'Hospital MedSync LTDA', '1234567', '12345678000199'),
('Hospital Central', 'Hospital Central S.A.', '2345678', '23456789000188'),
('Clinica Vida', 'Clinica Vida LTDA', '3456789', '34567890000177'),
('Santa Casa', 'Santa Casa de Misericordia', '4567890', '45678900000166'),
('Hospital Infantil', 'Hospital Infantil S.A.', '5678901', '56789010000155'),
('Hospital Regional', 'Hospital Regional LTDA', '6789012', '67890120000144'),
('Clinica Saude', 'Clinica Saude LTDA', '7890123', '78901230000133'),
('Hospital Norte', 'Hospital Norte LTDA', '8901234', '89012340000122'),
('Hospital Sul', 'Hospital Sul LTDA', '9012345', '90123450000111'),
('Centro Medico', 'Centro Medico Integrado LTDA', '0123456', '01234560000100');

/* Tabela Usuario */
INSERT INTO Usuario (
    usu_nome, usu_documento, usu_email, usu_senha, usu_datacriacao,
    inst_id, usu_telefone, usu_foto, usu_biometria, usu_tipo, usu_status
) VALUES
('Ana Almeida', '10000000001', 'ana.almeida@medsync.com', 'senha123', '2026-05-20 08:00:00', 1, '14990000001', NULL, NULL, 'Administrador', 1),
('Bruno Costa', '10000000002', 'bruno.costa@medsync.com', 'senha123', '2026-05-20 08:05:00', 2, '14990000002', NULL, NULL, 'Faturista', 1),
('Carla Dias', '10000000003', 'carla.dias@medsync.com', 'senha123', '2026-05-20 08:10:00', 3, '14990000003', NULL, NULL, 'Medico', 1),
('Diego Martins', '10000000004', 'diego.martins@medsync.com', 'senha123', '2026-05-20 08:15:00', 4, '14990000004', NULL, NULL, 'Medico', 1),
('Elisa Rocha', '10000000005', 'elisa.rocha@medsync.com', 'senha123', '2026-05-20 08:20:00', 5, '14990000005', NULL, NULL, 'Medico', 1),
('Fabio Lima', '10000000006', 'fabio.lima@medsync.com', 'senha123', '2026-05-20 08:25:00', 6, '14990000006', NULL, NULL, 'Medico', 1),
('Gabriela Nunes', '10000000007', 'gabriela.nunes@medsync.com', 'senha123', '2026-05-20 08:30:00', 7, '14990000007', NULL, NULL, 'Medico', 1),
('Henrique Souza', '10000000008', 'henrique.souza@medsync.com', 'senha123', '2026-05-20 08:35:00', 8, '14990000008', NULL, NULL, 'Medico', 1),
('Isabela Ramos', '10000000009', 'isabela.ramos@medsync.com', 'senha123', '2026-05-20 08:40:00', 9, '14990000009', NULL, NULL, 'Medico', 1),
('Joao Pereira', '10000000010', 'joao.pereira@medsync.com', 'senha123', '2026-05-20 08:45:00', 10, '14990000010', NULL, NULL, 'Medico', 1);

/* Tabela Medico */
INSERT INTO Medico (usu_id, med_nome, med_cpf, med_crm) VALUES
(1, 'Ana Almeida', '10000000001', '1000001'),
(2, 'Bruno Costa', '10000000002', '1000002'),
(3, 'Carla Dias', '10000000003', '1000003'),
(4, 'Diego Martins', '10000000004', '1000004'),
(5, 'Elisa Rocha', '10000000005', '1000005'),
(6, 'Fabio Lima', '10000000006', '1000006'),
(7, 'Gabriela Nunes', '10000000007', '1000007'),
(8, 'Henrique Souza', '10000000008', '1000008'),
(9, 'Isabela Ramos', '10000000009', '1000009'),
(10, 'Joao Pereira', '10000000010', '1000010');

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
('Marcos Pereira', '1983-12-09', '90000000010', '14991000010', '2026-05-20 09:45:00', 1, 2010, '700000000000010', 'Neusa Pereira', 'Parda', 'Centro', '104', 'Rua Brasil', '17600005', 'SP', 'Tupa', 3555002);

/* Tabela Atendimento */
INSERT INTO Atendimento (pac_id, con_id, leito_id, car_id, med_id, atend_data) VALUES
(1, 1, 1, 1, 1, '2026-05-20 10:00:00'),
(2, 2, 2, 2, 2, '2026-05-20 10:05:00'),
(3, 3, 3, 3, 3, '2026-05-20 10:10:00'),
(4, 4, 4, 4, 4, '2026-05-20 10:15:00'),
(5, 5, 5, 5, 5, '2026-05-20 10:20:00'),
(6, 6, 6, 6, 6, '2026-05-20 10:25:00'),
(7, 7, 7, 7, 7, '2026-05-20 10:30:00'),
(8, 8, 8, 8, 8, '2026-05-20 10:35:00'),
(9, 9, 9, 9, 9, '2026-05-20 10:40:00'),
(10, 10, 10, 10, 10, '2026-05-20 10:45:00');

/* Tabela Escolha_Clinica */
INSERT INTO Escolha_Clinica (cli_descricao) VALUES
('Medica'),
('Cirurgica'),
('Pediatrica'),
('Obstetrica'),
('Medica'),
('Cirurgica'),
('Pediatrica'),
('Obstetrica'),
('Medica'),
('Cirurgica');

/* Tabela Procedimento ignorada na regra de 10 registros */
INSERT INTO Procedimento (pro_codigo, pro_descricao) VALUES
(401020010, 'Curativo especial'),
(301010072, 'Consulta medica'),
(403010012, 'Eletrocardiograma'),
(202010058, 'Hemograma completo'),
(205020046, 'Raio X torax'),
(407030016, 'Ultrassonografia'),
(403020026, 'Ecocardiograma'),
(408010013, 'Tomografia'),
(409010030, 'Ressonancia'),
(412010054, 'Endoscopia');

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

/* Tabela Laudo */
INSERT INTO Laudo (
    atend_id, cli_id, cid_id, pro_id, lau_sinais, lau_internacao,
    lau_resultado, lau_recurso, lau_datapreenc, lau_status
) VALUES
(1, 1, 1, 1, 'Febre e mal-estar', 'Observacao clinica', 'Paciente estavel', 'Medicar e observar', '2026-05-20 11:00:00', 1),
(2, 2, 2, 2, 'Dor abdominal intensa', 'Internacao solicitada', 'Suspeita clinica avaliada', 'Solicitar exames', '2026-05-20 11:05:00', 1),
(3, 3, 3, 3, 'Tosse e dispneia', 'Internado em enfermaria', 'Imagem sugere pneumonia', 'Antibioticoterapia', '2026-05-20 11:10:00', 1),
(4, 4, 4, 4, 'Pressao elevada', 'Sem internacao', 'Quadro hipertensivo', 'Ajuste medicamentoso', '2026-05-20 11:15:00', 1),
(5, 5, 5, 5, 'Glicemia alterada', 'Sem internacao', 'Diabetes em acompanhamento', 'Orientacao clinica', '2026-05-20 11:20:00', 1),
(6, 6, 6, 6, 'Dor em membro inferior', 'Internacao cirurgica', 'Fratura confirmada', 'Encaminhar ortopedia', '2026-05-20 11:25:00', 1),
(7, 7, 7, 7, 'Disuria e febre', 'Observacao clinica', 'Infeccao urinaria provavel', 'Antibiotico oral', '2026-05-20 11:30:00', 1),
(8, 8, 8, 8, 'Dor lombar', 'Sem internacao', 'Lombalgia mecanica', 'Analgesia e repouso', '2026-05-20 11:35:00', 1),
(9, 9, 9, 9, 'Dor em fossa iliaca', 'Internacao cirurgica', 'Apendicite provavel', 'Avaliar cirurgia', '2026-05-20 11:40:00', 1),
(10, 10, 10, 10, 'Paciente assintomatico', 'Sem internacao', 'Exame de rotina', 'Acompanhamento anual', '2026-05-20 11:45:00', 1);

/* Tabela Favorito */
INSERT INTO Favorito (lau_id, med_id, fav_nome) VALUES
(1, 1, 'Febre'),
(2, 2, 'Dor abdominal'),
(3, 3, 'Pneumonia'),
(4, 4, 'Hipertensao'),
(5, 5, 'Diabetes'),
(6, 6, 'Fratura'),
(7, 7, 'ITU'),
(8, 8, 'Lombalgia'),
(9, 9, 'Apendicite'),
(10, 10, 'Checkup');
