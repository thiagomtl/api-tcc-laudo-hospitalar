require('dotenv').config();

const fs = require('fs');
const mysql = require('mysql2/promise');

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.BD_SERVIDOR,
        port: Number(process.env.BD_PORTA || 3306),
        user: process.env.BD_USUARIO,
        password: process.env.BD_SENHA,
        database: process.env.BD_BANCO,
        multipleStatements: true
    });

    try {
        const [[cid]] = await connection.query(
            'SELECT cid_id, cid_codigo, cid_descricao FROM CID WHERE cid_codigo = ? LIMIT 1',
            ['A419']
        );

        const [[procedimento]] = await connection.query(
            'SELECT pro_id, pro_codigo, pro_descricao FROM Procedimento WHERE pro_codigo = ? LIMIT 1',
            [303010037]
        );

        if (!cid) {
            throw new Error('CID A419 nao encontrado. Reset cancelado.');
        }

        if (!procedimento) {
            throw new Error('Procedimento 303010037 nao encontrado. Reset cancelado.');
        }

        console.log('CID encontrado:', cid);
        console.log('Procedimento encontrado:', procedimento);

        const sql = fs.readFileSync('src/dataBase/reset_dados_tcc.sql', 'utf8');
        await connection.query(sql);

        const [usuarios] = await connection.query(
            'SELECT usu_id, usu_nome, usu_usuario, usu_tipo FROM Usuario ORDER BY usu_id'
        );

        const [contagens] = await connection.query(`
            SELECT 'CID' tabela, COUNT(*) total FROM CID
            UNION ALL SELECT 'Procedimento', COUNT(*) FROM Procedimento
            UNION ALL SELECT 'Procedimento_Cids', COUNT(*) FROM Procedimento_Cids
            UNION ALL SELECT 'Usuario', COUNT(*) FROM Usuario
            UNION ALL SELECT 'Paciente', COUNT(*) FROM Paciente
            UNION ALL SELECT 'Atendimento', COUNT(*) FROM Atendimento
            UNION ALL SELECT 'Laudo', COUNT(*) FROM Laudo
            UNION ALL SELECT 'Favorito', COUNT(*) FROM Favorito
            UNION ALL SELECT 'Leito', COUNT(*) FROM Leito
        `);

        console.table(usuarios);
        console.table(contagens);
    } finally {
        await connection.end();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
