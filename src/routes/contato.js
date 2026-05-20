const express = require('express');
const router = express.Router();

const ContatoController = require('../controllers/contato');

router.post('/contato', ContatoController.enviarContato);

module.exports = router;
