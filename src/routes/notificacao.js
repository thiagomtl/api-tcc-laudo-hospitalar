const express = require('express');
const router = express.Router();

const NotificacaoController = require('../controllers/notificacao');

router.get('/notificacoes', NotificacaoController.listarNotificacoes);
router.get('/notificacoes/stream', NotificacaoController.acompanharNotificacoes);

module.exports = router;
