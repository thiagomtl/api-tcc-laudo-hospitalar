const db = require('../dataBase/connection');

const {
    validarCPF,
    validarEmail,
    validarTelefone
} = require('../utils/validacoesUsuarios');

function limparDocumento(documento) {
    if (!documento) return '';
    return String(documento).replace(/\D/g, '');
}

function limparTelefone(telefone) {
    if (!telefone) return '';
    return String(telefone).replace(/\D/g, '');
}

module.exports = {
    async listarUsuario(request, response) {
        try {
            const sql = `
                SELECT 
                    usu_id,
                    usu_nome,
                    usu_documento,
                    usu_email,
                    usu_senha,
                    usu_datacriacao,
                    inst_id,
                    usu_telefone,
                    usu_foto,
                    usu_biometria,
                    usu_tipo,
                    usu_status
                FROM Usuario
                WHERE usu_status = 1
                ORDER BY usu_id DESC;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários obtida com sucesso.',
                itens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar usuários: ${error.message}`,
                dados: null
            });
        }
    },

    async loginUsuario(request, response) {
        try {
            const { email, senha } = request.body;

            if (!email || !senha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'E-mail e senha são obrigatórios.',
                    dados: null
                });
            }

            const sql = `
                SELECT 
                    usu_id,
                    usu_nome,
                    usu_email,
                    usu_tipo,
                    inst_id,
                    usu_status
                FROM Usuario
                WHERE usu_email = ? AND usu_senha = ? AND usu_status = 1;
            `;

            const values = [email, senha];
            const [rows] = await db.query(sql, values);

            if (rows.length < 1) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Login e/ou senha inválidos.',
                    dados: null
                });
            }

            const usuario = rows[0];

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Login efetuado com sucesso.',
                dados: {
                    id: usuario.usu_id,
                    nome: usuario.usu_nome,
                    email: usuario.usu_email,
                    tipo: usuario.usu_tipo,
                    inst_id: usuario.inst_id
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao realizar login: ${error.message}`,
                dados: null
            });
        }
    },

    async cadastrarUsuario(request, response) {
        try {
            let {
                nome,
                documento,
                senha,
                email,
                telefone,
                tipo,
                inst_id,
                foto,
                biometria,
                status
            } = request.body;

            if (!nome || !documento || !senha || !email || !telefone || !tipo || !inst_id) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Campos obrigatórios estão ausentes ou inválidos.',
                    dados: null
                });
            }

            documento = limparDocumento(documento);
            telefone = limparTelefone(telefone);

            if (!validarEmail(email)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'E-mail inválido.',
                    dados: null
                });
            }

            if (!validarCPF(documento)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Documento inválido.',
                    dados: null
                });
            }

            if (!validarTelefone(telefone)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Telefone inválido.',
                    dados: null
                });
            }

            const [emailExiste] = await db.query(
                `SELECT usu_id FROM Usuario WHERE usu_email = ?`,
                [email]
            );

            if (emailExiste.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'E-mail já cadastrado.',
                    dados: null
                });
            }

            const [documentoExiste] = await db.query(
                `SELECT usu_id FROM Usuario WHERE usu_documento = ?`,
                [documento]
            );

            if (documentoExiste.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'Documento já cadastrado.',
                    dados: null
                });
            }

            if (status === undefined || status === null) {
                status = 1;
            }

            const sql = `
                INSERT INTO Usuario (
                    usu_nome,
                    usu_documento,
                    usu_email,
                    usu_senha,
                    usu_datacriacao,
                    inst_id,
                    usu_telefone,
                    usu_foto,
                    usu_biometria,
                    usu_tipo,
                    usu_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const values = [
                nome,
                documento,
                email,
                senha,
                new Date(),
                inst_id,
                telefone,
                foto || null,
                biometria || null,
                tipo,
                status
            ];

            const [result] = await db.query(sql, values);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Usuário cadastrado com sucesso.',
                dados: {
                    id: result.insertId,
                    nome,
                    documento,
                    email,
                    telefone,
                    tipo,
                    inst_id,
                    foto: foto || null,
                    biometria: biometria || null,
                    status
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar usuário: ${error.message}`,
                dados: null
            });
        }
    },

    async editarUsuario(request, response) {
        try {
            let {
                nome,
                documento,
                senha,
                email,
                telefone,
                tipo,
                inst_id
            } = request.body;

            const { id } = request.params;

            if (!nome || !documento || !senha || !email || !telefone || !tipo || !inst_id) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Campos obrigatórios estão ausentes ou inválidos.',
                    dados: null
                });
            }

            documento = limparDocumento(documento);
            telefone = limparTelefone(telefone);

            if (!validarEmail(email)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'E-mail inválido.',
                    dados: null
                });
            }

            if (!validarCPF(documento)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Documento inválido.',
                    dados: null
                });
            }

            if (!validarTelefone(telefone)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Telefone inválido.',
                    dados: null
                });
            }

            const sql = `
                UPDATE Usuario SET 
                    usu_nome = ?,
                    usu_documento = ?,
                    usu_email = ?,
                    usu_senha = ?,
                    inst_id = ?,
                    usu_telefone = ?,
                    usu_tipo = ?
                WHERE usu_id = ?;
            `;

            const values = [
                nome,
                documento,
                email,
                senha,
                inst_id,
                telefone,
                tipo,
                id
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} atualizado com sucesso.`,
                dados: {
                    id,
                    nome,
                    documento,
                    email,
                    senha,
                    telefone,
                    tipo,
                    inst_id
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar usuário: ${error.message}`,
                dados: null
            });
        }
    },

    async apagarUsuario(request, response) {
        try {
            const { id } = request.params;

            const sql = `DELETE FROM Usuario WHERE usu_id = ?`;
            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} excluído com sucesso.`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar usuário: ${error.message}`,
                dados: null
            });
        }
    },

    async ocultarUsuario(request, response) {
        try {
            const { id } = request.params;

            const sql = `
                UPDATE Usuario
                SET usu_status = 0
                WHERE usu_id = ?;
            `;

            const values = [id];
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} desativado com sucesso.`,
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao ocultar usuário: ${error.message}`,
                dados: null
            });
        }
    }
};