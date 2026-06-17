/* Reset dos dados de teste do TCC preservando tabelas robustas.
   Nao altera:
   - CID
   - Procedimento
   - Procedimento_Cids

   Execute depois que as tabelas estruturais ja existirem no banco.
*/

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Favorito;
TRUNCATE TABLE Laudo;
TRUNCATE TABLE Atendimento;
TRUNCATE TABLE Mensagem_Chat;
TRUNCATE TABLE Logs_Acao;
TRUNCATE TABLE Medico;
TRUNCATE TABLE Usuario;
TRUNCATE TABLE Paciente;
TRUNCATE TABLE Escolha_Clinica;
TRUNCATE TABLE Leito;
TRUNCATE TABLE Setor;
TRUNCATE TABLE Carater;
TRUNCATE TABLE Convenio;
TRUNCATE TABLE Instituicao;

SET FOREIGN_KEY_CHECKS = 1;

/* Tabela Convenio */
INSERT INTO Convenio (con_tipo) VALUES
('SUS'),
('Unimed Tupa'),
('Unimed Intercambio'),
('Particular'),
('Iamspe'),
('Santa Casa Saude'),
('Bradesco Saude'),
('SulAmerica');

/* Tabela Setor */
INSERT INTO Setor (set_nome) VALUES
('UTI A'),
('UTI B'),
('UTI C'),
('Pediatria'),
('Ala Convenio'),
('Ala SUS/Feminino'),
('Ala SUS/Masculino'),
('Ala Cirurgica SUS'),
('Ala Cirurgica Mista'),
('Maternidade');

/* Tabela Leito */
INSERT INTO Leito (set_id, leito_identificacao) VALUES
(1, 'UTI-A 01'),
(1, 'UTI-A 02'),
(2, 'UTI-B 01'),
(2, 'UTI-B 02'),
(3, 'UTI-C 01'),
(3, 'UTI-C 02'),
(4, 'PED 01'),
(4, 'PED 02'),
(5, 'CONV 01'),
(5, 'CONV 02'),
(6, 'SUS-F 01'),
(6, 'SUS-F 02'),
(7, 'SUS-M 01'),
(7, 'SUS-M 02'),
(8, 'CIR-SUS 01'),
(8, 'CIR-SUS 02'),
(9, 'CIR-MISTA 01'),
(9, 'CIR-MISTA 02'),
(10, 'MAT 01'),
(10, 'MAT 02');

/* Tabela Carater */
INSERT INTO Carater (car_tipo) VALUES
('Urgencia'),
('Eletivo'),
('Obstetrica');

/* Tabela Escolha_Clinica */
INSERT INTO Escolha_Clinica (cli_descricao) VALUES
('Medica'),
('Cirurgica'),
('Pediatrica'),
('Obstetrica');

/* Tabela Instituicao */
INSERT INTO Instituicao (inst_nome, inst_razao_social, inst_cnes, inst_cnpj) VALUES
('Hospital MedSync', 'Hospital MedSync LTDA', '1234567', '12345678000199');

/* Tabela Usuario */
/* Senha padrao dos tres usuarios: 123456 */
INSERT INTO Usuario (
    usu_nome, usu_usuario, usu_documento, usu_email, usu_senha, usu_datacriacao,
    inst_id, usu_telefone, usu_foto, usu_biometria, usu_tipo, usu_status
) VALUES
('Thiago Melo', 'thiagom', '10000000001', 'thiago.melo@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:00:00', 1, '14996123702', NULL, NULL, 'Administrador', 1),
('Joao Marcos', 'joaom', '10000000002', 'joao.marcos@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:05:00', 1, '14996784967', NULL, NULL, 'Faturista', 1),
('Luiz Henrique', 'luizh', '10000000003', 'luiz.henrique@medsync.com', '$2b$10$fioIX3f9fkrcLbAIjbLSJOXOrDWfMPnwWD1L7Se7vh6FKUk2jHTF.', '2026-05-20 08:10:00', 1, '14996427297', NULL, NULL, 'Medico', 1);

INSERT INTO Medico (usu_id, med_crm, med_especialidade, med_assinatura) VALUES
((SELECT usu_id FROM Usuario WHERE usu_usuario = 'luizh'), '123456', 'Cardiologista', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MjAiIGhlaWdodD0iMTQwIiB2aWV3Qm94PSIwIDAgNDIwIDE0MCI+CiAgPHJlY3Qgd2lkdGg9IjQyMCIgaGVpZ2h0PSIxNDAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAiLz4KICA8cGF0aCBkPSJNMzUgODggQzY4IDUyLCA4NCA1MiwgNzQgODIgQzY2IDEwNiwgNDcgMTEwLCA0OCA4OSBDNTAgNTgsIDkyIDU1LCAxMTYgODAgQzEzNCA5OSwgMTU2IDEwMCwgMTcyIDc5IEMxODIgNjYsIDE4OCA2MSwgMTkwIDcwIEMxOTQgOTEsIDE3MCAxMTUsIDE2MCA5OSBDMTUxIDg0LCAxNzggNjIsIDIwNSA3NyBDMjI2IDg5LCAyMzIgMTA0LCAyNTAgODkgQzI2MiA3OSwgMjczIDYxLCAyNzcgNzIgQzI4NCA5NCwgMjYwIDExNiwgMjUwIDEwMCBDMjQyIDg4LCAyNjEgNzAsIDI4NSA3OCBDMzA0IDg0LCAzMTUgMTAxLCAzMzMgODcgQzM0OCA3NSwgMzU4IDY5LCAzNjUgNzUgQzM3NCA4NCwgMzY0IDEwMSwgMzQ2IDEwMyBDMzE5IDEwNiwgMzA5IDkyLCAzMjYgODAgQzM0NSA2NywgMzc0IDc4LCAzOTIgODYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8cGF0aCBkPSJNNzcgMTA3IEMxNDMgMTE3LCAyMzAgMTE2LCAzNTkgMTA3IiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjciLz4KPC9zdmc+');

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
('Pedro Henrique', '2016-03-22', '90000000004', '14991000004', '2026-05-20 09:15:00', 1, 2004, '700000000000004', 'Ana Henrique', 'Branca', 'Jardim America', '45', 'Rua C', '17600002', 'SP', 'Tupa', 3555002),
('Juliana Lima', '2000-11-30', '90000000005', '14991000005', '2026-05-20 09:20:00', 0, 2005, '700000000000005', 'Patricia Lima', 'Preta', 'Centro', '210', 'Rua D', '17600003', 'SP', 'Tupa', 3555002),
('Roberto Alves', '1978-07-19', '90000000006', '14991000006', '2026-05-20 09:25:00', 1, 2006, '700000000000006', 'Sandra Alves', 'Parda', 'Industrial', '77', 'Rua E', '17600004', 'SP', 'Tupa', 3555002),
('Ana Clara Santos', '1997-02-14', '90000000007', '14991000007', '2026-05-20 09:30:00', 0, 2007, '700000000000007', 'Marcia Santos', 'Branca', 'Centro', '101', 'Rua das Flores', '17600000', 'SP', 'Tupa', 3555002),
('Bruno Carvalho', '1988-06-21', '90000000008', '14991000008', '2026-05-20 09:35:00', 1, 2008, '700000000000008', 'Helena Carvalho', 'Parda', 'Vila Abarca', '102', 'Rua Sao Paulo', '17600001', 'SP', 'Tupa', 3555002),
('Camila Rocha', '1992-09-03', '90000000009', '14991000009', '2026-05-20 09:40:00', 0, 2009, '700000000000009', 'Regina Rocha', 'Branca', 'Jardim America', '103', 'Rua Rio Branco', '17600002', 'SP', 'Tupa', 3555002),
('Marcos Pereira', '1983-12-09', '90000000010', '14991000010', '2026-05-20 09:45:00', 1, 2010, '700000000000010', 'Neusa Pereira', 'Parda', 'Centro', '104', 'Rua Brasil', '17600005', 'SP', 'Tupa', 3555002),
('Beatriz Nunes', '1991-01-18', '90000000011', '14991000011', '2026-05-20 09:50:00', 0, 2011, '700000000000011', 'Helena Nunes', 'Branca', 'Centro', '105', 'Rua Brasil', '17600005', 'SP', 'Tupa', 3555002),
('Daniel Moraes', '2014-04-27', '90000000012', '14991000012', '2026-05-20 09:55:00', 1, 2012, '700000000000012', 'Fatima Moraes', 'Parda', 'Jardim Europa', '56', 'Rua Europa', '17600006', 'SP', 'Tupa', 3555002),
('Renata Farias', '1999-10-11', '90000000013', '14991000013', '2026-05-20 10:00:00', 0, 2013, '700000000000013', 'Silvia Farias', 'Preta', 'Vila Nova', '78', 'Rua Nova', '17600007', 'SP', 'Tupa', 3555002),
('Gustavo Reis', '1975-12-05', '90000000014', '14991000014', '2026-05-20 10:05:00', 1, 2014, '700000000000014', 'Marcia Reis', 'Branca', 'Centro', '109', 'Rua Para', '17600008', 'SP', 'Tupa', 3555002),
('Sofia Martins', '2002-03-09', '90000000015', '14991000015', '2026-05-20 10:10:00', 0, 2015, '700000000000015', 'Eliane Martins', 'Parda', 'Vila Abarca', '92', 'Rua Minas', '17600009', 'SP', 'Tupa', 3555002),
('Rafael Gomes', '1980-06-16', '90000000016', '14991000016', '2026-05-20 10:15:00', 1, 2016, '700000000000016', 'Neide Gomes', 'Branca', 'Industrial', '43', 'Rua Bahia', '17600010', 'SP', 'Tupa', 3555002),
('Laura Castro', '1993-07-24', '90000000017', '14991000017', '2026-05-20 10:20:00', 0, 2017, '700000000000017', 'Sonia Castro', 'Parda', 'Centro', '132', 'Rua Ceara', '17600011', 'SP', 'Tupa', 3555002),
('Eduardo Silva', '1986-09-13', '90000000018', '14991000018', '2026-05-20 10:25:00', 1, 2018, '700000000000018', 'Luzia Silva', 'Preta', 'Jardim America', '67', 'Rua Goias', '17600012', 'SP', 'Tupa', 3555002),
('Patricia Araujo', '1996-02-03', '90000000019', '14991000019', '2026-05-20 10:30:00', 0, 2019, '700000000000019', 'Marta Araujo', 'Branca', 'Vila Nova', '88', 'Rua Acre', '17600013', 'SP', 'Tupa', 3555002),
('Felipe Barbosa', '1979-11-29', '90000000020', '14991000020', '2026-05-20 10:35:00', 1, 2020, '700000000000020', 'Ivone Barbosa', 'Parda', 'Centro', '144', 'Rua Mato Grosso', '17600014', 'SP', 'Tupa', 3555002);

SET @usu_id_medico = (
    SELECT u.usu_id
    FROM Usuario u
    INNER JOIN Medico m ON m.usu_id = u.usu_id
    WHERE u.usu_usuario = 'luizh'
);

/* Tabela Atendimento: 20 atendimentos do usuario medico */
INSERT INTO Atendimento (pac_id, con_id, leito_id, car_id, usu_id, atend_data) VALUES
(1, 1, 1, 1, @usu_id_medico, '2026-05-20 11:00:00'),
(2, 2, 3, 2, @usu_id_medico, '2026-05-20 11:05:00'),
(3, 3, 5, 3, @usu_id_medico, '2026-05-20 11:10:00'),
(4, 4, 7, 1, @usu_id_medico, '2026-05-20 11:15:00'),
(5, 5, 19, 3, @usu_id_medico, '2026-05-20 11:20:00'),
(6, 6, 9, 1, @usu_id_medico, '2026-05-20 11:25:00'),
(7, 1, 11, 1, @usu_id_medico, '2026-05-20 11:30:00'),
(8, 7, 13, 2, @usu_id_medico, '2026-05-20 11:35:00'),
(9, 8, 17, 2, @usu_id_medico, '2026-05-20 11:40:00'),
(10, 1, 15, 1, @usu_id_medico, '2026-05-20 11:45:00'),
(11, 2, 12, 2, @usu_id_medico, '2026-05-20 11:50:00'),
(12, 3, 8, 2, @usu_id_medico, '2026-05-20 11:55:00'),
(13, 4, 10, 1, @usu_id_medico, '2026-05-20 12:00:00'),
(14, 5, 14, 1, @usu_id_medico, '2026-05-20 12:05:00'),
(15, 6, 20, 3, @usu_id_medico, '2026-05-20 12:10:00'),
(16, 7, 6, 1, @usu_id_medico, '2026-05-20 12:15:00'),
(17, 8, 18, 2, @usu_id_medico, '2026-05-20 12:20:00'),
(18, 1, 16, 1, @usu_id_medico, '2026-05-20 12:25:00'),
(19, 2, 2, 2, @usu_id_medico, '2026-05-20 12:30:00'),
(20, 3, 4, 1, @usu_id_medico, '2026-05-20 12:35:00');

/* IDs buscados na base robusta. Nao assume que cid_id/pro_id sejam 1, 2, 3... */
SET @cid_a419 = (SELECT cid_id FROM CID WHERE cid_codigo = 'A419' LIMIT 1);
SET @pro_303010037 = (SELECT pro_id FROM Procedimento WHERE pro_codigo = 303010037 LIMIT 1);

INSERT INTO Laudo (
    atend_id, cli_id, cid_id, pro_id, lau_sinais, lau_internacao,
    lau_resultado, lau_recurso, lau_datapreenc, lau_status
) VALUES
(1, 1, @cid_a419, @pro_303010037, 'Febre e mal-estar', 'Observacao clinica', 'Paciente estavel', 'Medicar e observar', '2026-05-20 13:00:00', 1);

/* Tabela Favorito */
INSERT INTO Favorito (
    usu_id, fav_nome, cid_id, pro_id, cli_id, fav_carater,
    fav_sinais, fav_internacao, fav_resultado, fav_recurso
) VALUES
(@usu_id_medico, 'Sepse', @cid_a419, @pro_303010037, 1, 'Urgencia', 'Febre e mal-estar', 'Observacao clinica', 'Paciente estavel', 'Medicar e observar');
