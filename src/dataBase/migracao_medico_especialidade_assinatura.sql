-- Migracao para adicionar especialidade e assinatura ao medico.
-- Execute em uma copia/backup antes de aplicar no banco principal.

ALTER TABLE Medico
ADD COLUMN med_especialidade VARCHAR(100) NULL AFTER med_crm,
ADD COLUMN med_assinatura TEXT NULL AFTER med_especialidade;
