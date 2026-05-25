const db = require('../dataBase/connection');
const normalizarTextoLaudo = require('../utils/normalizarTextoLaudo');

function obterMedicoId(request) {
    return request.usuario?.med_id || null;
}

function normalizarCampo(valor) {
    return valor === undefined || valor === null || valor === ''
        ? null
        : normalizarTextoLaudo(valor);
}

function montarFavorito(row) {
    if (!row) {
        return null;
    }

    return {
        id: row.fav_id,
        fav_id: row.fav_id,
        med_id: row.med_id,
        nome: row.fav_nome,
        nomeModelo: row.fav_nome,
        cid: row.cid_id,
        codigoCid: row.cid_codigo,
        procedimento: row.pro_id,
        codigoProcedimento: row.pro_codigo,
        descricaoProcedimento: row.pro_descricao,
        clinica: row.cli_id,
        caraterInternacao: row.fav_carater,
        sinaisSintomas: row.fav_sinais,
        justificativa: row.fav_internacao,
        resultadosExames: row.fav_resultado,
        recursosNecessarios: row.fav_recurso
    };
}

async function buscarFavoritoPorId(id, medId) {
    const [rows] = await db.query(
        `
            SELECT
                fav.fav_id,
                fav.med_id,
                fav.fav_nome,
                fav.cid_id,
                cid.cid_codigo,
                fav.pro_id,
                pro.pro_codigo,
                pro.pro_descricao,
                fav.cli_id,
                fav.fav_carater,
                fav.fav_sinais,
                fav.fav_internacao,
                fav.fav_resultado,
                fav.fav_recurso
            FROM Favorito fav
            LEFT JOIN CID cid ON cid.cid_id = fav.cid_id
            LEFT JOIN Procedimento pro ON pro.pro_id = fav.pro_id
            WHERE fav.fav_id = ? AND fav.med_id = ?
        `,
        [id, medId]
    );

    return rows[0] || null;
}

module.exports = {
    async listarFavorito(request, response) {
        try {
            const medId = obterMedicoId(request);

            if (!medId) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Usuario medico nao identificado.',
                    dados: null
                });
            }

            const { nome } = request.query;
            const favNome = nome ? `%${normalizarTextoLaudo(nome)}%` : `%`;

            const [rows] = await db.query(
                `
                    SELECT
                        fav.fav_id,
                        fav.med_id,
                        fav.fav_nome,
                        fav.cid_id,
                        cid.cid_codigo,
                        fav.pro_id,
                        pro.pro_codigo,
                        pro.pro_descricao,
                        fav.cli_id,
                        fav.fav_carater,
                        fav.fav_sinais,
                        fav.fav_internacao,
                        fav.fav_resultado,
                        fav.fav_recurso
                    FROM Favorito fav
                    LEFT JOIN CID cid ON cid.cid_id = fav.cid_id
                    LEFT JOIN Procedimento pro ON pro.pro_id = fav.pro_id
                    WHERE fav.med_id = ?
                      AND fav.fav_nome LIKE ?
                    ORDER BY fav.fav_id DESC
                `,
                [medId, favNome]
            );

            const dados = rows.map(montarFavorito);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de favoritos obtida com sucesso',
                nItens: dados.length,
                dados
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar favoritos: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarFavorito(request, response) {
        try {
            const medId = obterMedicoId(request);

            if (!medId) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Usuario medico nao identificado.',
                    dados: null
                });
            }

            const {
                fav_nome,
                nome,
                nomeModelo,
                cid_id,
                cid,
                pro_id,
                procedimento,
                cli_id,
                clinica,
                caraterInternacao,
                sinaisSintomas,
                justificativa,
                resultadosExames,
                recursosNecessarios
            } = request.body;

            const nomeFavorito = normalizarCampo(fav_nome || nome || nomeModelo);

            if (!nomeFavorito) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome do favorito e obrigatorio.',
                    dados: null
                });
            }

            const [duplicado] = await db.query(
                'SELECT fav_id FROM Favorito WHERE med_id = ? AND fav_nome = ?',
                [medId, nomeFavorito]
            );

            if (duplicado.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'Ja existe um laudo favorito com esse nome.',
                    dados: null
                });
            }

            const [result] = await db.query(
                `
                    INSERT INTO Favorito (
                        med_id,
                        fav_nome,
                        cid_id,
                        pro_id,
                        cli_id,
                        fav_carater,
                        fav_sinais,
                        fav_internacao,
                        fav_resultado,
                        fav_recurso
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    medId,
                    nomeFavorito,
                    cid_id || cid || null,
                    pro_id || procedimento || null,
                    cli_id || clinica || null,
                    normalizarCampo(caraterInternacao),
                    normalizarCampo(sinaisSintomas),
                    normalizarCampo(justificativa),
                    normalizarCampo(resultadosExames),
                    normalizarCampo(recursosNecessarios)
                ]
            );

            const favorito = await buscarFavoritoPorId(result.insertId, medId);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Favorito cadastrado com sucesso',
                dados: montarFavorito(favorito)
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar favorito: ${error.message}`,
                dados: null
            });
        }
    },

    async editarFavorito(request, response) {
        try {
            const medId = obterMedicoId(request);
            const { id } = request.params;

            if (!medId) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Usuario medico nao identificado.',
                    dados: null
                });
            }

            const {
                fav_nome,
                nome,
                nomeModelo,
                cid_id,
                cid,
                pro_id,
                procedimento,
                cli_id,
                clinica,
                caraterInternacao,
                sinaisSintomas,
                justificativa,
                resultadosExames,
                recursosNecessarios
            } = request.body;

            const nomeFavorito = normalizarCampo(fav_nome || nome || nomeModelo);

            if (!nomeFavorito) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nome do favorito e obrigatorio.',
                    dados: null
                });
            }

            const [duplicado] = await db.query(
                'SELECT fav_id FROM Favorito WHERE med_id = ? AND fav_nome = ? AND fav_id != ?',
                [medId, nomeFavorito, id]
            );

            if (duplicado.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'Ja existe um laudo favorito com esse nome.',
                    dados: null
                });
            }

            const [result] = await db.query(
                `
                    UPDATE Favorito
                    SET
                        fav_nome = ?,
                        cid_id = ?,
                        pro_id = ?,
                        cli_id = ?,
                        fav_carater = ?,
                        fav_sinais = ?,
                        fav_internacao = ?,
                        fav_resultado = ?,
                        fav_recurso = ?
                    WHERE fav_id = ?
                      AND med_id = ?
                `,
                [
                    nomeFavorito,
                    cid_id || cid || null,
                    pro_id || procedimento || null,
                    cli_id || clinica || null,
                    normalizarCampo(caraterInternacao),
                    normalizarCampo(sinaisSintomas),
                    normalizarCampo(justificativa),
                    normalizarCampo(resultadosExames),
                    normalizarCampo(recursosNecessarios),
                    id,
                    medId
                ]
            );

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Favorito ${id} nao encontrado.`,
                    dados: null
                });
            }

            const favorito = await buscarFavoritoPorId(id, medId);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Favorito ${id} atualizado com sucesso`,
                dados: montarFavorito(favorito)
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar favorito: ${error.message}`,
                dados: null
            });
        }
    },

    async apagarFavorito(request, response) {
        try {
            const medId = obterMedicoId(request);
            const { id } = request.params;

            if (!medId) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Usuario medico nao identificado.',
                    dados: null
                });
            }

            const [result] = await db.query(
                'DELETE FROM Favorito WHERE fav_id = ? AND med_id = ?',
                [id, medId]
            );

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Favorito ${id} nao encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Favorito ${id} excluido com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar favorito: ${error.message}`,
                dados: null
            });
        }
    },
};
