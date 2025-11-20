const db = require('../dataBase/connection');

module.exports = {
    async listarUsuario(request, response) {
        try {

            const sql = `SELECT usu_id, usu_nome, usu_documento, usu_email, 
            usu_senha, usu_datacriacao, inst_id, usu_telefone, usu_foto, 
            usu_biometria, usu_tipo, usu_status = 1 as usu_status
            FROM Usuario;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Lista de usuário obtida com sucesso',
                    itens: rows.length,
                    dados: rows

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao listar usuário: ${error.message}`,
                    dados: null
                }
            );
        }

    },
    async cadastrarUsuario(request, response) {
        try {

            const { nome, documento, senha, email, telefone, tipo, inst_id,foto,biometria,status} = request.body;
            const usu_ativo = 1;

            const sql = `
  INSERT INTO Usuario (
    usu_nome,
    usu_documento,
    usu_email,S
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
                telefone,
                tipo,
                usu_ativo,
                inst_id,
                foto,
                biometria,
                status,
               

            ];



         

            const dados = {
                nome,
                documento,
                email,
                senha,
                telefone,
                tipo,
                usu_ativo,
                inst_id,
                foto,
                biometria,
                status

            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Cadastro de usuário obtida com sucesso',
                    dados: dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao cadastrar usuário: ${error.message} `,
                    dados: error.message
                }
            );
        }

    },
    async editarUsuario(request, response) {
        try {



            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Atualização de usuário obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar usuário: ${error.message} `,
                    dados: null
                }
            );
        }

    },
    async apagarUsuario(request, response) {
        try {



            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: 'Exclusão de usuário obtida com sucesso',
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar usuário: ${error.message} `,
                    dados: null
                }
            );
        }

    },


}