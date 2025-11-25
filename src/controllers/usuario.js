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

            const { nome, documento, senha, email, telefone, tipo, inst_id, foto, biometria, status } = request.body;
            const usu_ativo = 1;

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
                foto,
                biometria,
                tipo,
                status,


            ];


            const [result] = await db.query(sql, values);


            const dados = {
                id: result.insertId,
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
                    mensagem: 'Cadastro de usuário obtido com sucesso',
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

            const { nome, documento, senha, email, telefone, tipo,  status, inst_id } = request.body;

            const { id } = request.params;

            const sql = ` UPDATE Usuario SET 
             usu_nome = ?, usu_documento = ?, usu_email = ?, usu_senha = ?, inst_id = ?, usu_telefone = ? , usu_tipo = ?
             WHERE 
             usu_id = ?
             `;

             const values = [nome, documento ,email,  senha, inst_id, telefone, tipo, status,id];

            const [result] = await db.query(sql,values);


            if (result.affectedRows === 0){
                return response.status(404).json({
                    sucesso:false,
                    mensagem:`Usuário ${id} não encontrado!`,
                    dados:null
                });
            }

            const dados ={
                id,
                nome,
                documento,
                email,
                senha,
                telefone,
                tipo,
                inst_id,
                status
            };

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Usuário ${id} atualizado com sucesso!`,
                    dados

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao atualizar usuário: ${error.message} `,
                    dados: error.message
                }
            );
        }

    },
    async apagarUsuario(request, response) {
        try {

            const { id } = request.params;

            const sql = `DELETE FROM Usuario where usu_id = ?`;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0){
                return response.status(404).json({
                    sucesso:false,
                    mensagem:`Usuário ${id} não encontrado!`,
                    dados:null
                });
            }

            return response.status(200).json(
                {
                    sucesso: true,
                    mensagem: `Usuário ${id} excluído com sucesso`,
                    dados: null

                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                    sucesso: false,
                    mensagem: `Erro ao apagar usuário: ${error.message} `,
                    dados: error.message
                }
            );
        }

    },


}