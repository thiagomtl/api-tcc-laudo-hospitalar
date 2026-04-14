require('dotenv').config();

const express = require('express');
const cors = require('cors');

const router = require('./src/routes/routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
    response.send('API do sistema de laudos hospitalares online');
});

app.use(router);

const porta = process.env.PORT || 3333;

app.listen(porta, () => {
    console.log(`Servidor iniciado em http://${process.env.SERVER || 'localhost'}:${porta}`);
});