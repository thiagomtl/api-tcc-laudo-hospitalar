const db = require('../dataBase/connection');

function normalizarCrm(crm) {
    return String(crm || '').replace(/\D/g, '').slice(0, 6);
}

function crmValido(crm) {
    return /^\d{6}$/.test(String(crm || ''));
}

function normalizarCampoOpcional(valor) {
    if (valor === undefined) {
        return undefined;
    }

    if (valor === null) {
        return null;
    }

    const texto = String(valor).trim();

    return texto || null;
}

function campoFoiInformado(body, campoPrincipal, campoAlternativo) {
    return Object.prototype.hasOwnProperty.call(body, campoPrincipal) ||
        Object.prototype.hasOwnProperty.call(body, campoAlternativo);
}

function obterCampoOpcional(body, campoPrincipal, campoAlternativo) {
    if (Object.prototype.hasOwnProperty.call(body, campoPrincipal)) {
        return body[campoPrincipal];
    }

    return body[campoAlternativo];
}

module.exports = {
    async listarMedico(request, response) {
        try {
            const sql = `
                SELECT
                    m.usu_id,
                    u.usu_nome AS med_nome,
                    u.usu_documento AS med_cpf,
                    u.usu_email AS med_email,
                    u.usu_tipo,
                    m.med_crm,
                    m.med_especialidade,
                    m.med_assinatura
                FROM Medico m
                INNER JOIN Usuario u ON u.usu_id = m.usu_id
                WHERE u.usu_tipo IN ('Medico', 'Médico')
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de medicos obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar medicos: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarMedico(request, response) {
        try {
            const { usu_id, crm } = request.body;
            const crmNormalizado = normalizarCrm(crm);
            const especialidade = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_especialidade', 'especialidade')
            );
            const assinatura = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_assinatura', 'assinatura')
            );

            if (!usu_id || !crmNormalizado) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuario e CRM sao obrigatorios.',
                    dados: null
                });
            }

            if (!crmValido(crmNormalizado)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM deve conter exatamente 6 digitos.',
                    dados: null
                });
            }

            const [usuarioExistente] = await db.query(
                `
                SELECT usu_id
                FROM Usuario
                WHERE usu_id = ?
                  AND usu_tipo IN ('Medico', 'Médico')
                  AND usu_status = 1
                `,
                [usu_id]
            );

            if (usuarioExistente.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuario medico nao encontrado.',
                    dados: null
                });
            }

            const [usuarioVinculado] = await db.query(
                'SELECT usu_id FROM Medico WHERE usu_id = ?',
                [usu_id]
            );

            if (usuarioVinculado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Este usuario ja esta vinculado a um medico.',
                    dados: null
                });
            }

            const [crmExistente] = await db.query(
                'SELECT usu_id FROM Medico WHERE med_crm = ?',
                [crmNormalizado]
            );

            if (crmExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM ja cadastrado.',
                    dados: null
                });
            }

            await db.query(
                `
                INSERT INTO Medico (usu_id, med_crm, med_especialidade, med_assinatura)
                VALUES (?, ?, ?, ?)
                `,
                [
                    usu_id,
                    crmNormalizado,
                    especialidade ?? null,
                    assinatura ?? null
                ]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de medico realizado com sucesso',
                dados: {
                    id: Number(usu_id),
                    usu_id: Number(usu_id),
                    crm: crmNormalizado,
                    especialidade: especialidade ?? null,
                    assinatura: assinatura ?? null,
                    med_especialidade: especialidade ?? null,
                    med_assinatura: assinatura ?? null
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar medico: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarMedico(request, response) {
        try {
            const { crm } = request.body;
            const { id } = request.params;
            const usuarioId = Number(id);
            const crmNormalizado = normalizarCrm(crm);
            const especialidadeInformada = campoFoiInformado(request.body, 'med_especialidade', 'especialidade');
            const assinaturaInformada = campoFoiInformado(request.body, 'med_assinatura', 'assinatura');
            const especialidade = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_especialidade', 'especialidade')
            );
            const assinatura = normalizarCampoOpcional(
                obterCampoOpcional(request.body, 'med_assinatura', 'assinatura')
            );

            if (!usuarioId) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Usuario do medico e obrigatorio.',
                    dados: null
                });
            }

            if (!crmNormalizado) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM e obrigatorio.',
                    dados: null
                });
            }

            if (!crmValido(crmNormalizado)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM deve conter exatamente 6 digitos.',
                    dados: null
                });
            }

            const [medicoExistente] = await db.query(
                `
                SELECT usu_id, med_especialidade, med_assinatura
                FROM Medico
                WHERE usu_id = ?
                `,
                [usuarioId]
            );

            if (medicoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Medico do usuario ${usuarioId} nao encontrado!`,
                    dados: null
                });
            }

            const [crmDuplicado] = await db.query(
                `
                SELECT usu_id
                FROM Medico
                WHERE med_crm = ?
                  AND usu_id != ?
                `,
                [crmNormalizado, usuarioId]
            );

            if (crmDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Ja existe outro medico com este CRM.',
                    dados: null
                });
            }

            const especialidadeAtualizada = especialidadeInformada
                ? especialidade
                : medicoExistente[0].med_especialidade;
            const assinaturaAtualizada = assinaturaInformada
                ? assinatura
                : medicoExistente[0].med_assinatura;

            await db.query(
                `
                UPDATE Medico
                SET
                    med_crm = ?,
                    med_especialidade = ?,
                    med_assinatura = ?
                WHERE usu_id = ?
                `,
                [
                    crmNormalizado,
                    especialidadeAtualizada,
                    assinaturaAtualizada,
                    usuarioId
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: `Medico do usuario ${usuarioId} atualizado com sucesso`,
                dados: {
                    id: usuarioId,
                    usu_id: usuarioId,
                    crm: crmNormalizado,
                    especialidade: especialidadeAtualizada,
                    assinatura: assinaturaAtualizada,
                    med_especialidade: especialidadeAtualizada,
                    med_assinatura: assinaturaAtualizada
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar medico: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarMedico(request, response) {
        try {
            const { id } = request.params;
            const usuarioId = Number(id);

            const [medicoExistente] = await db.query(
                'SELECT usu_id FROM Medico WHERE usu_id = ?',
                [usuarioId]
            );

            if (medicoExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Medico do usuario ${usuarioId} nao encontrado!`,
                    dados: null
                });
            }

            const [atendimentosVinculados] = await db.query(
                'SELECT atend_id FROM Atendimento WHERE usu_id = ?',
                [usuarioId]
            );

            const [favoritosVinculados] = await db.query(
                'SELECT fav_id FROM Favorito WHERE usu_id = ?',
                [usuarioId]
            );

            if (atendimentosVinculados.length > 0 || favoritosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Nao e possivel excluir o medico porque existem atendimentos ou favoritos vinculados a ele.',
                    dados: null
                });
            }

            await db.query(
                'DELETE FROM Medico WHERE usu_id = ?',
                [usuarioId]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: `Medico do usuario ${usuarioId} excluido com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar medico: ${error.message}`,
                dados: error.message
            });
        }
    }
};
