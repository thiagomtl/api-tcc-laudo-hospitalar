UPDATE Favorito
SET fav_carater = COALESCE(fav_carater, fav_carater_internacao)
WHERE fav_carater_internacao IS NOT NULL;

ALTER TABLE Favorito DROP FOREIGN KEY favorito_ibfk_1;

ALTER TABLE Favorito
  DROP COLUMN lau_id,
  DROP COLUMN fav_carater_internacao;
