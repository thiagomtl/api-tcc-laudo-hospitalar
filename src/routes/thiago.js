const express = require('express');
const router = express.Router();

const {
  autenticarToken,
  somenteAdministrador
} = require('../middlewares/auth');

const AtendimentoController = require('../controllers/atendimento');
const ConvenioController = require('../controllers/convenio');
const LeitoController = require('../controllers/leito');

// ATENDIMENTO
router.get('/atendimento', autenticarToken, AtendimentoController.listarAtendimento);
router.get('/atendimento/listar-atend', autenticarToken, AtendimentoController.listarAtend);
router.get('/atendimento/pendentes', autenticarToken, AtendimentoController.listarAtendimentosPendentes);

router.post('/atendimento', autenticarToken, somenteAdministrador, AtendimentoController.cadastrarAtendimento);
router.patch('/atendimento/:id', autenticarToken, somenteAdministrador, AtendimentoController.editarAtendimento);
router.delete('/atendimento/:id', autenticarToken, somenteAdministrador, AtendimentoController.apagarAtendimento);

// CONVÊNIO
router.get('/convenio', autenticarToken, ConvenioController.listarConvenio);
router.post('/convenio', autenticarToken, somenteAdministrador, ConvenioController.cadastrarConvenio);
router.patch('/convenio/:id', autenticarToken, somenteAdministrador, ConvenioController.editarConvenio);
router.delete('/convenio/:id', autenticarToken, somenteAdministrador, ConvenioController.apagarConvenio);

// LEITO
router.get('/leito', autenticarToken, LeitoController.listarLeito);
router.post('/leito', autenticarToken, somenteAdministrador, LeitoController.cadastrarLeito);
router.patch('/leito/:id', autenticarToken, somenteAdministrador, LeitoController.editarLeito);
router.delete('/leito/:id', autenticarToken, somenteAdministrador, LeitoController.apagarLeito);

module.exports = router;
