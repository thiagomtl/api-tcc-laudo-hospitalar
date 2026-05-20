const express = require('express');
const router = express.Router();

const IntegracaoController = require('../controllers/integracao');

router.post('/integracao/atendimento-pendente', IntegracaoController.criarAtendimentoPendente);

module.exports = router;
