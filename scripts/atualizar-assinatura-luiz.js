require('dotenv').config();

const mysql = require('mysql2/promise');

const ASSINATURA_LUIZ =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MjAiIGhlaWdodD0iMTQwIiB2aWV3Qm94PSIwIDAgNDIwIDE0MCI+CiAgPHJlY3Qgd2lkdGg9IjQyMCIgaGVpZ2h0PSIxNDAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAiLz4KICA8cGF0aCBkPSJNMzUgODggQzY4IDUyLCA4NCA1MiwgNzQgODIgQzY2IDEwNiwgNDcgMTEwLCA0OCA4OSBDNTAgNTgsIDkyIDU1LCAxMTYgODAgQzEzNCA5OSwgMTU2IDEwMCwgMTcyIDc5IEMxODIgNjYsIDE4OCA2MSwgMTkwIDcwIEMxOTQgOTEsIDE3MCAxMTUsIDE2MCA5OSBDMTUxIDg0LCAxNzggNjIsIDIwNSA3NyBDMjI2IDg5LCAyMzIgMTA0LCAyNTAgODkgQzI2MiA3OSwgMjczIDYxLCAyNzcgNzIgQzI4NCA5NCwgMjYwIDExNiwgMjUwIDEwMCBDMjQyIDg4LCAyNjEgNzAsIDI4NSA3OCBDMzA0IDg0LCAzMTUgMTAxLCAzMzMgODcgQzM0OCA3NSwgMzU4IDY5LCAzNjUgNzUgQzM3NCA4NCwgMzY0IDEwMSwgMzQ2IDEwMyBDMzE5IDEwNiwgMzA5IDkyLCAzMjYgODAgQzM0NSA2NywgMzc0IDc4LCAzOTIgODYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8cGF0aCBkPSJNNzcgMTA3IEMxNDMgMTE3LCAyMzAgMTE2LCAzNTkgMTA3IiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjciLz4KPC9zdmc+';

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.BD_SERVIDOR,
        port: Number(process.env.BD_PORTA || 3306),
        user: process.env.BD_USUARIO,
        password: process.env.BD_SENHA,
        database: process.env.BD_BANCO
    });

    try {
        const [result] = await connection.query(
            `UPDATE Medico m
             INNER JOIN Usuario u ON u.usu_id = m.usu_id
             SET m.med_assinatura = ?
             WHERE u.usu_usuario = ?`,
            [ASSINATURA_LUIZ, 'luizh']
        );

        const [[medico]] = await connection.query(
            `SELECT u.usu_nome, u.usu_usuario, LENGTH(m.med_assinatura) AS tamanho_assinatura
             FROM Medico m
             INNER JOIN Usuario u ON u.usu_id = m.usu_id
             WHERE u.usu_usuario = ?`,
            ['luizh']
        );

        console.log({ linhasAfetadas: result.affectedRows, medico });
    } finally {
        await connection.end();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
