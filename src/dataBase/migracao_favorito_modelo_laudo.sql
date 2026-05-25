ALTER TABLE Favorito
  ADD COLUMN cid_id INT NULL,
  ADD COLUMN pro_id INT NULL,
  ADD COLUMN cli_id INT NULL,
  ADD COLUMN fav_carater VARCHAR(30) NULL,
  ADD COLUMN fav_sinais VARCHAR(1024) NULL,
  ADD COLUMN fav_internacao VARCHAR(1024) NULL,
  ADD COLUMN fav_resultado VARCHAR(512) NULL,
  ADD COLUMN fav_recurso VARCHAR(512) NULL,
  ADD CONSTRAINT fk_favorito_cid FOREIGN KEY (cid_id) REFERENCES CID(cid_id),
  ADD CONSTRAINT fk_favorito_procedimento FOREIGN KEY (pro_id) REFERENCES Procedimento(pro_id),
  ADD CONSTRAINT fk_favorito_clinica FOREIGN KEY (cli_id) REFERENCES Escolha_Clinica(cli_id);
