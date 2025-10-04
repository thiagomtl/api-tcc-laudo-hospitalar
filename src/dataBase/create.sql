-- Script de criação das tabelas conforme dicionário de dados
-- Adaptado para MySQL

CREATE TABLE Paciente (
    pac_id INT AUTO_INCREMENT PRIMARY KEY,
    pac_nome VARCHAR(60) NOT NULL,
    pac_datanasc DATE,
    pac_cpf CHAR(11) UNIQUE,
    pac_telefone VARCHAR(15),
    pac_datacadastro DATETIME,
    pac_sexo BIT,
    pac_num_prontuario INT,
    pac_cns CHAR(15),
    pac_nome_mae VARCHAR(60),
    pac_raca VARCHAR(10),
    pac_bairro VARCHAR(50),
    pac_num_casa VARCHAR(7),
    pac_logradouro VARCHAR(120),
    pac_cep CHAR(8),
    pac_uf CHAR(2),
    pac_municipio VARCHAR(50),
    pac_cod_ibge INT
);

CREATE TABLE Convenio (
    con_id INT AUTO_INCREMENT PRIMARY KEY,
    con_tipo VARCHAR(50)
);

CREATE TABLE Setor (
    set_id INT AUTO_INCREMENT PRIMARY KEY,
    set_nome VARCHAR(30)
);

CREATE TABLE Leito (
    leito_id INT AUTO_INCREMENT PRIMARY KEY,
    set_id INT,
    leito_identificacao VARCHAR(20),
    FOREIGN KEY (set_id) REFERENCES Setor(set_id)
);

CREATE TABLE Carater (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    car_tipo VARCHAR(30)
);

CREATE TABLE Instituicao (
    inst_id INT AUTO_INCREMENT PRIMARY KEY,
    inst_nome VARCHAR(100),
    inst_razao_social VARCHAR(150),
    inst_cnes CHAR(7),
    inst_cnpj CHAR(14)
);

CREATE TABLE Usuario (
    usu_id INT AUTO_INCREMENT PRIMARY KEY,
    usu_nome VARCHAR(100),
    usu_documento VARCHAR(11),
    usu_email VARCHAR(100),
    usu_senha VARCHAR(100),
    usu_datacriacao DATETIME,
    inst_id INT,
    usu_telefone VARCHAR(15),
    usu_foto VARCHAR(255),
    usu_biometria VARCHAR(255),
    usu_tipo VARCHAR(15),
    usu_status BIT,
    FOREIGN KEY (inst_id) REFERENCES Instituicao(inst_id)
);

CREATE TABLE Medico (
    med_id INT AUTO_INCREMENT PRIMARY KEY,
    med_crm VARCHAR(8)
);

CREATE TABLE Atendimento (
    atend_id INT AUTO_INCREMENT PRIMARY KEY,
    pac_id INT,
    con_id INT,
    leito_id INT,
    car_id INT,
    med_id INT,
    atend_data DATETIME,
    FOREIGN KEY (pac_id) REFERENCES Paciente(pac_id),
    FOREIGN KEY (con_id) REFERENCES Convenio(con_id),
    FOREIGN KEY (leito_id) REFERENCES Leito(leito_id),
    FOREIGN KEY (car_id) REFERENCES Carater(car_id),
    FOREIGN KEY (med_id) REFERENCES Medico(med_id)
);

CREATE TABLE Logs_Acao (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    usu_id INT,
    log_acao VARCHAR(200),
    log_detalhe VARCHAR(30),
    log_datahora DATETIME,
    FOREIGN KEY (usu_id) REFERENCES Usuario(usu_id)
);

CREATE TABLE Mensagem_Chat (
    msg_id INT AUTO_INCREMENT PRIMARY KEY,
    usu_id_remetente INT,
    usu_id_destinatario INT,
    msg_conteudo VARCHAR(500),
    msg_arqanexo VARCHAR(255),
    msg_datahoraenvio DATETIME,
    msg_status VARCHAR(10),
    msg_resposta INT,
    FOREIGN KEY (usu_id_remetente) REFERENCES Usuario(usu_id),
    FOREIGN KEY (usu_id_destinatario) REFERENCES Usuario(usu_id),
    FOREIGN KEY (msg_resposta) REFERENCES Mensagem_Chat(msg_id)
);

CREATE TABLE Escolha_Clinica (
    cli_id INT AUTO_INCREMENT PRIMARY KEY,
    cli_descricao VARCHAR(20)
);

CREATE TABLE Procedimento (
    pro_id INT AUTO_INCREMENT PRIMARY KEY,
    pro_codigo INT,
    pro_descricao VARCHAR(100)
);

CREATE TABLE CID (
    cid_id INT AUTO_INCREMENT PRIMARY KEY,
    cid_codigo VARCHAR(4),
    cid_descricao VARCHAR(100)
);

CREATE TABLE Procedimento_Cids (
    proc_cid_id INT AUTO_INCREMENT PRIMARY KEY,
    pro_id INT,
    cid_id INT,
    FOREIGN KEY (pro_id) REFERENCES Procedimento(pro_id),
    FOREIGN KEY (cid_id) REFERENCES CID(cid_id)
);

CREATE TABLE Laudo (
    lau_id INT AUTO_INCREMENT PRIMARY KEY,
    atend_id INT,
    cli_id INT,
    proc_cid_id INT,
    lau_sinais VARCHAR(1024),
    lau_internacao VARCHAR(1024),
    lau_resultado VARCHAR(512),
    lau_recurso VARCHAR(512),
    lau_datapreenc DATETIME,
    lau_status BIT,
    FOREIGN KEY (atend_id)
        REFERENCES Atendimento (atend_id),
    FOREIGN KEY (cli_id)
        REFERENCES Escolha_Clinica (cli_id),
    FOREIGN KEY (proc_cid_id)
        REFERENCES Procedimento_Cids (proc_cid_id)
);

CREATE TABLE Favorito (
    fav_id INT AUTO_INCREMENT PRIMARY KEY,
    lau_id INT,
    med_id INT,
    fav_nome VARCHAR(30),
    FOREIGN KEY (lau_id) REFERENCES Laudo(lau_id),
    FOREIGN KEY (med_id) REFERENCES Medico(med_id)
);
