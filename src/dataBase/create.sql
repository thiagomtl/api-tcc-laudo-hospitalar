-- Script de criação das tabelas conforme dicionário de dados
-- Adaptado para MySQL

CREATE TABLE Paciente (
    pac_id INT AUTO_INCREMENT PRIMARY KEY,
    pac_nome VARCHAR(60) NOT NULL,
    pac_datanasc DATE NOT NULL,
    pac_cpf CHAR(11) UNIQUE NOT NULL,
    pac_telefone VARCHAR(15) NOT NULL,
    pac_datacadastro DATETIME NOT NULL,
    pac_sexo BIT NOT NULL,
    pac_num_prontuario INT NOT NULL,
    pac_cns CHAR(15) NOT NULL,
    pac_nome_mae VARCHAR(60) NOT NULL,
    pac_raca VARCHAR(10) NOT NULL,
    pac_bairro VARCHAR(50) NOT NULL,
    pac_num_casa VARCHAR(7) NOT NULL,
    pac_logradouro VARCHAR(120) NOT NULL,
    pac_cep CHAR(8) NOT NULL,
    pac_uf CHAR(2) NOT NULL,
    pac_municipio VARCHAR(50) NOT NULL,
    pac_cod_ibge INT NOT NULL
);

CREATE TABLE Convenio (
    con_id INT AUTO_INCREMENT PRIMARY KEY,
    con_tipo VARCHAR(50) NOT NULL
);

CREATE TABLE Setor (
    set_id INT AUTO_INCREMENT PRIMARY KEY,
    set_nome VARCHAR(30) NOT NULL
);

CREATE TABLE Leito (
    leito_id INT AUTO_INCREMENT PRIMARY KEY,
    set_id INT NOT NULL,
    leito_identificacao VARCHAR(20) NOT NULL,
    FOREIGN KEY (set_id) REFERENCES Setor(set_id) 
);

CREATE TABLE Carater (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    car_tipo VARCHAR(30) NOT NULL
);

CREATE TABLE Instituicao (
    inst_id INT AUTO_INCREMENT PRIMARY KEY,
    inst_nome VARCHAR(100) NOT NULL,
    inst_razao_social VARCHAR(150) NOT NULL,
    inst_cnes CHAR(7) NOT NULL,
    inst_cnpj CHAR(14) NOT NULL
);

CREATE TABLE Usuario (
    usu_id INT AUTO_INCREMENT PRIMARY KEY,
    usu_nome VARCHAR(100) NOT NULL,
    usu_documento VARCHAR(11) NOT NULL,
    usu_email VARCHAR(100) NOT NULL,
    usu_senha VARCHAR(100) NOT NULL,
    usu_datacriacao DATETIME NOT NULL,
    inst_id INT NOT NULL,
    usu_telefone VARCHAR(15) NOT NULL,
    usu_foto VARCHAR(255) NULL,
    usu_biometria VARCHAR(255) NULL,
    usu_tipo VARCHAR(15) NOT NULL,
    usu_status BIT NOT NULL,
    FOREIGN KEY (inst_id) REFERENCES Instituicao(inst_id)
);

CREATE TABLE Medico (
    med_id INT AUTO_INCREMENT PRIMARY KEY,
    med_crm VARCHAR(8) NOT NULL
);

CREATE TABLE Atendimento (
    atend_id INT AUTO_INCREMENT PRIMARY KEY,
    pac_id INT NOT NULL,
    con_id INT NOT NULL,
    leito_id INT NOT NULL,
    car_id INT NOT NULL,
    med_id INT NOT NULL,
    atend_data DATETIME NOT NULL,
    FOREIGN KEY (pac_id) REFERENCES Paciente(pac_id),
    FOREIGN KEY (con_id) REFERENCES Convenio(con_id),
    FOREIGN KEY (leito_id) REFERENCES Leito(leito_id),
    FOREIGN KEY (car_id) REFERENCES Carater(car_id),
    FOREIGN KEY (med_id) REFERENCES Medico(med_id)
);

CREATE TABLE Logs_Acao (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    usu_id INT NOT NULL,
    log_acao VARCHAR(200) NOT NULL,
    log_detalhe VARCHAR(30) NOT NULL,
    log_datahora DATETIME NOT NULL,
    FOREIGN KEY (usu_id) REFERENCES Usuario(usu_id)
);

CREATE TABLE Mensagem_Chat (
    msg_id INT AUTO_INCREMENT PRIMARY KEY,
    usu_id_remetente INT NOT NULL,
    usu_id_destinatario INT NOT NULL,
    msg_conteudo VARCHAR(500) NULL,
    msg_arqanexo VARCHAR(255) NULL,
    msg_datahoraenvio DATETIME NOT NULL,
    msg_status VARCHAR(10) NOT NULL,
    msg_resposta INT NULL,
    FOREIGN KEY (usu_id_remetente) REFERENCES Usuario(usu_id),
    FOREIGN KEY (usu_id_destinatario) REFERENCES Usuario(usu_id),
    FOREIGN KEY (msg_resposta) REFERENCES Mensagem_Chat(msg_id)
);

CREATE TABLE Escolha_Clinica (
    cli_id INT AUTO_INCREMENT PRIMARY KEY,
    cli_descricao VARCHAR(20) NOT NULL
);

CREATE TABLE Procedimento (
    pro_id INT AUTO_INCREMENT PRIMARY KEY,
    pro_codigo INT NULL,
    pro_descricao VARCHAR(100) NULL
);

CREATE TABLE CID (
    cid_id INT AUTO_INCREMENT PRIMARY KEY,
    cid_codigo VARCHAR(4) NOT NULL,
    cid_descricao VARCHAR(100) NOT NULL
);

CREATE TABLE Procedimento_Cids (
    proc_cid_id INT AUTO_INCREMENT PRIMARY KEY,
    pro_id INT NULL,
    cid_id INT NOT NULL,
    FOREIGN KEY (pro_id) REFERENCES Procedimento(pro_id),
    FOREIGN KEY (cid_id) REFERENCES CID(cid_id)
);

CREATE TABLE Laudo (
    lau_id INT AUTO_INCREMENT PRIMARY KEY,
    atend_id INT NOT NULL,
    cli_id INT NOT NULL,
    proc_cid_id INT NOT NULL,
    lau_sinais VARCHAR(1024) NOT NULL,
    lau_internacao VARCHAR(1024) NOT NULL,
    lau_resultado VARCHAR(512) NOT NULL,
    lau_recurso VARCHAR(512) NOT NULL,
    lau_datapreenc DATETIME NOT NULL,
    lau_status BIT NOT NULL,
    FOREIGN KEY (atend_id)
        REFERENCES Atendimento (atend_id),
    FOREIGN KEY (cli_id)
        REFERENCES Escolha_Clinica (cli_id),
    FOREIGN KEY (proc_cid_id)
        REFERENCES Procedimento_Cids (proc_cid_id)
);

CREATE TABLE Favorito (
    fav_id INT AUTO_INCREMENT PRIMARY KEY,
    lau_id INT NULL,
    med_id INT NOT NULL,
    fav_nome VARCHAR(30) NOT NULL,
    FOREIGN KEY (lau_id) REFERENCES Laudo(lau_id),
    FOREIGN KEY (med_id) REFERENCES Medico(med_id)
);
