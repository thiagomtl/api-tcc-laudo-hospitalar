const db = require('../dataBase/connection');

module.exports = {
    async listarCarater(request, response) {
        try {
            const sql = `
                SELECT
                    car_id,
                    car_tipo
                FROM Carater
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de caráter obtida com sucesso',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar caráter: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarCarater(request, response) {
        try {
            const { carater } = request.body;

            if (!carater) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O tipo de caráter é obrigatório.',
                    dados: null
                });
            }

            const [caraterExistente] = await db.query(
                `
                SELECT car_id
                FROM Carater
                WHERE car_tipo = ?
                `,
                [carater]
            );

            if (caraterExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe caráter cadastrado com esse nome.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO Carater (car_tipo)
                VALUES (?)
            `;

            const [result] = await db.query(sql, [carater]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Caráter cadastrado com sucesso',
                dados: {
                    id: result.insertId,
                    carater
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar caráter: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarCarater(request, response) {
        try {
            const { carater } = request.body;
            const { id } = request.params;

            if (!carater) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O tipo de caráter é obrigatório.',
                    dados: null
                });
            }

            const [caraterAtual] = await db.query(
                `
                SELECT car_id
                FROM Carater
                WHERE car_id = ?
                `,
                [id]
            );

            if (caraterAtual.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Caráter ID ${id} não encontrado para atualização.`,
                    dados: null
                });
            }

            const [caraterDuplicado] = await db.query(
                `
                SELECT car_id
                FROM Carater
                WHERE car_tipo = ?
                  AND car_id != ?
                `,
                [carater, id]
            );

            if (caraterDuplicado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Já existe outro caráter com esse nome.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Carater
                SET car_tipo = ?
                WHERE car_id = ?
            `;

            await db.query(sql, [carater, id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Caráter ID ${id} atualizado com sucesso`,
                dados: {
                    id: Number(id),
                    carater
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar caráter: ${error.message}`,
                dados: error.message
            });
        }
    },

    async apagarCarater(request, response) {
        try {
            const { id } = request.params;

            const [caraterExistente] = await db.query(
                `
                SELECT car_id
                FROM Carater
                WHERE car_id = ?
                `,
                [id]
            );

            if (caraterExistente.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Caráter ID ${id} não encontrado para exclusão.`,
                    dados: null
                });
            }

            const [atendimentosVinculados] = await db.query(
                `
                SELECT atend_id
                FROM Atendimento
                WHERE car_id = ?
                `,
                [id]
            );

            if (atendimentosVinculados.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Não é possível excluir o caráter porque existem atendimentos vinculados a ele.',
                    dados: null
                });
            }

            const sql = `
                DELETE FROM Carater
                WHERE car_id = ?
            `;

            await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Caráter ID ${id} excluído com sucesso`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar caráter: ${error.message}`,
                dados: error.message
            });
        }
    }
};