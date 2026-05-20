-- Migracao para vincular Medico ao Usuario por usu_id.
-- Execute em uma copia/backup antes de aplicar no banco principal.

ALTER TABLE Medico
ADD COLUMN usu_id INT NULL AFTER med_id;

-- Preencha manualmente os vinculos corretos antes de aplicar NOT NULL/FK.
-- Exemplo:
-- UPDATE Medico SET usu_id = 3 WHERE med_id = 1;
-- UPDATE Medico SET usu_id = 5 WHERE med_id = 2;

SELECT
    u.usu_id,
    u.usu_nome,
    u.usu_tipo,
    m.med_id,
    m.med_crm,
    m.usu_id AS medico_usu_id
FROM Usuario u
LEFT JOIN Medico m ON m.usu_id = u.usu_id
WHERE u.usu_tipo IN ('Médico', 'Medico')
ORDER BY u.usu_id;

-- Confira se ainda existe medico sem usuario antes de continuar.
SELECT med_id, med_crm
FROM Medico
WHERE usu_id IS NULL;

ALTER TABLE Medico
MODIFY usu_id INT NOT NULL;

ALTER TABLE Medico
ADD CONSTRAINT uq_medico_usuario UNIQUE (usu_id);

ALTER TABLE Medico
ADD CONSTRAINT fk_medico_usuario
FOREIGN KEY (usu_id) REFERENCES Usuario(usu_id);
