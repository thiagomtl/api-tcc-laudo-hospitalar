-- SELECTs de todos os campos de cada tabela
SELECT pac_id, pac_nome, pac_datanasc, pac_cpf, pac_telefone, pac_datacadastro, pac_sexo, pac_num_prontuario, pac_cns, pac_nome_mae, pac_raca, pac_bairro, pac_num_casa, pac_logradouro, pac_cep, pac_uf, pac_municipio, pac_cod_ibge FROM Paciente;
SELECT con_id, con_tipo FROM Convenio;
SELECT set_id, set_nome FROM Setor;
SELECT leito_id, set_id, leito_identificacao FROM Leito;
SELECT car_id, car_tipo FROM Carater;
SELECT inst_id, inst_nome, inst_razao_social, inst_cnes, inst_cnpj FROM Instituicao;
SELECT usu_id, usu_nome, usu_documento, usu_email, usu_senha, usu_datacriacao, inst_id, usu_telefone, usu_foto, usu_biometria, usu_tipo, usu_status FROM Usuario;
SELECT med_id, usu_id, med_crm FROM Medico;
SELECT atend_id, pac_id, con_id, leito_id, car_id, med_id, atend_data FROM Atendimento;
SELECT log_id, usu_id, log_acao, log_detalhe, log_datahora FROM Logs_Acao;
SELECT msg_id, usu_id_remetente, usu_id_destinatario, msg_conteudo, msg_arqanexo, msg_datahoraenvio, msg_status, msg_resposta FROM Mensagem_Chat;
SELECT cli_id, cli_descricao FROM Escolha_Clinica;
SELECT pro_id, pro_codigo, pro_descricao FROM Procedimento;
SELECT cid_id, cid_codigo, cid_descricao FROM CID;
SELECT proc_cid_id, pro_id, cid_id FROM Procedimento_Cids;
SELECT lau_id, atend_id, cli_id, proc_cid_id, lau_sinais, lau_internacao, lau_resultado, lau_recurso, lau_datapreenc, lau_status FROM Laudo;
SELECT fav_id, lau_id, med_id, fav_nome FROM Favorito;


-- SELECTs com INNER JOIN para tabelas com chave estrangeira
SELECT leito_id, set_id, leito_identificacao, Setor.set_nome FROM Leito INNER JOIN Setor ON Leito.set_id = Setor.set_id;
SELECT usu_id, usu_nome, usu_documento, usu_email, usu_senha, usu_datacriacao, Usuario.inst_id, Instituicao.inst_nome, usu_telefone, usu_foto, usu_biometria, usu_tipo, usu_status FROM Usuario INNER JOIN Instituicao ON Usuario.inst_id = Instituicao.inst_id;
SELECT atend_id, Paciente.pac_nome, Convenio.con_tipo, Leito.leito_identificacao, Carater.car_tipo, Usuario.usu_nome AS med_nome, Medico.med_crm, atend_data FROM Atendimento 
INNER JOIN Paciente ON Atendimento.pac_id = Paciente.pac_id
INNER JOIN Convenio ON Atendimento.con_id = Convenio.con_id
INNER JOIN Leito ON Atendimento.leito_id = Leito.leito_id
INNER JOIN Carater ON Atendimento.car_id = Carater.car_id
INNER JOIN Medico ON Atendimento.med_id = Medico.med_id
INNER JOIN Usuario ON Medico.usu_id = Usuario.usu_id;
SELECT log_id, Usuario.usu_nome, log_acao, log_detalhe, log_datahora FROM Logs_Acao INNER JOIN Usuario ON Logs_Acao.usu_id = Usuario.usu_id;
SELECT msg_id, Remetente.usu_nome AS remetente, Destinatario.usu_nome AS destinatario, msg_conteudo, msg_arqanexo, msg_datahoraenvio, msg_status, msg_resposta FROM Mensagem_Chat 
INNER JOIN Usuario Remetente ON Mensagem_Chat.usu_id_remetente = Remetente.usu_id
INNER JOIN Usuario Destinatario ON Mensagem_Chat.usu_id_destinatario = Destinatario.usu_id;
SELECT proc_cid_id, Procedimento.pro_codigo, CID.cid_codigo FROM Procedimento_Cids 
INNER JOIN Procedimento ON Procedimento_Cids.pro_id = Procedimento.pro_id
INNER JOIN CID ON Procedimento_Cids.cid_id = CID.cid_id;
SELECT lau_id, Atendimento.atend_id, Escolha_Clinica.cli_descricao, Procedimento_Cids.proc_cid_id, lau_sinais, lau_internacao, lau_resultado, lau_recurso, lau_datapreenc, lau_status FROM Laudo 
INNER JOIN Atendimento ON Laudo.atend_id = Atendimento.atend_id
INNER JOIN Escolha_Clinica ON Laudo.cli_id = Escolha_Clinica.cli_id
INNER JOIN Procedimento_Cids ON Laudo.proc_cid_id = Procedimento_Cids.proc_cid_id;
SELECT fav_id, Laudo.lau_id, Usuario.usu_nome AS med_nome, Medico.med_crm, fav_nome FROM Favorito 
INNER JOIN Laudo ON Favorito.lau_id = Laudo.lau_id
INNER JOIN Medico ON Favorito.med_id = Medico.med_id
INNER JOIN Usuario ON Medico.usu_id = Usuario.usu_id;

-- LAUDO, ATENDIMENTO, USUARIO, MEDICO
SELECT l.lau_id, l.atend_id, a.atend_data, m.med_id, m.med_crm, u.usu_id, u.usu_nome AS med_nome, u.usu_email AS med_email, l.lau_resultado, l.lau_datapreenc, l.lau_status
FROM Laudo l
INNER JOIN Atendimento a ON l.atend_id = a.atend_id
INNER JOIN Medico m ON a.med_id = m.med_id
INNER JOIN Usuario u ON m.usu_id = u.usu_id;


-- DROP TABLEs na ordem correta para evitar erros de dependência
DROP TABLE IF EXISTS Favorito;
DROP TABLE IF EXISTS Laudo;
DROP TABLE IF EXISTS Procedimento_Cids;
DROP TABLE IF EXISTS Atendimento;
DROP TABLE IF EXISTS Mensagem_Chat;
DROP TABLE IF EXISTS Logs_Acao;
DROP TABLE IF EXISTS Medico;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Leito;
DROP TABLE IF EXISTS Setor;
DROP TABLE IF EXISTS Carater;
DROP TABLE IF EXISTS Instituicao;
DROP TABLE IF EXISTS Convenio;
DROP TABLE IF EXISTS Escolha_Clinica;
DROP TABLE IF EXISTS Procedimento;
DROP TABLE IF EXISTS CID;
DROP TABLE IF EXISTS Paciente;


-- APAGAR USUARIO POR ID
SET @OLD_SQL_SAFE_UPDATES = @@SQL_SAFE_UPDATES;
SET SQL_SAFE_UPDATES = 0;

START TRANSACTION;

DROP TEMPORARY TABLE IF EXISTS tmp_usuarios_excluir;

CREATE TEMPORARY TABLE tmp_usuarios_excluir (
    usu_id INT PRIMARY KEY
);

INSERT INTO tmp_usuarios_excluir (usu_id) VALUES
(1), (2), (3); --Defina os IDs dos usuários a serem excluídos

DELETE l
FROM Laudo l
JOIN Atendimento a ON a.atend_id = l.atend_id
JOIN Medico m ON m.med_id = a.med_id
JOIN tmp_usuarios_excluir t ON t.usu_id = m.usu_id;

DELETE f
FROM Favorito f
JOIN Medico m ON m.med_id = f.med_id
JOIN tmp_usuarios_excluir t ON t.usu_id = m.usu_id;

DELETE a
FROM Atendimento a
JOIN Medico m ON m.med_id = a.med_id
JOIN tmp_usuarios_excluir t ON t.usu_id = m.usu_id;

DELETE m
FROM Medico m
JOIN tmp_usuarios_excluir t ON t.usu_id = m.usu_id;

DELETE lc
FROM Logs_Acao lc
JOIN tmp_usuarios_excluir t ON t.usu_id = lc.usu_id;

DELETE mc
FROM Mensagem_Chat mc
JOIN tmp_usuarios_excluir t
  ON t.usu_id = mc.usu_id_remetente
  OR t.usu_id = mc.usu_id_destinatario;

DELETE u
FROM Usuario u
JOIN tmp_usuarios_excluir t ON t.usu_id = u.usu_id;

DROP TEMPORARY TABLE IF EXISTS tmp_usuarios_excluir;

COMMIT;

SET SQL_SAFE_UPDATES = @OLD_SQL_SAFE_UPDATES;