const express = require('express');
const router = express.Router();

const thiago = require('./thiago');
const luizHenrique = require('./luizHenrique');
const luisFernando = require('./luisFernando');
const joao = require('./joao');
const integracao = require('./integracao');
const notificacao = require('./notificacao');
const contato = require('./contato');
const codigoConfirmacao = require('./codigoConfirmacao');

router.use('/', thiago);
router.use('/', luizHenrique);
router.use('/', luisFernando);
router.use('/', joao);
router.use('/', integracao);
router.use('/', notificacao);
router.use('/', contato);
router.use('/', codigoConfirmacao);

module.exports = router;
