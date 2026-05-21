const express = require('express');
const router = express.Router();

const CodigoConfirmacaoController = require('../controllers/codigoConfirmacao');
const {
    autenticarToken,
    somenteAdministrador
} = require('../middlewares/auth');

router.post(
    '/usuarios/codigo-confirmacao',
    autenticarToken,
    somenteAdministrador,
    CodigoConfirmacaoController.enviarCodigoConfirmacao
);

module.exports = router;
