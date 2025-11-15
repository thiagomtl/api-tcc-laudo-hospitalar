const express = require('express');
const router = express.Router();

const AtendimentoController = require('../controllers/atendimento');
const ConvenioController = require('../controllers/convenio');
const LeitoController = require('../controllers/leito');

router.get('/atendimento', AtendimentoController.listarAtendimento);
router.post('/atendimento', AtendimentoController.cadastrarAtendimento);
router.patch('/atendimento', AtendimentoController.editarAtendimento);
router.delete('/atendimento', AtendimentoController.apagarAtendimento);

router.get('/convenio', ConvenioController.listarConvenio);
router.post('/convenio', ConvenioController.cadastrarConvenio);
router.patch('/convenio', ConvenioController.editarConvenio);
router.delete('/convenio', ConvenioController.apagarConvenio);

router.get('/leito', LeitoController.listarLeito);
router.post('/leito', LeitoController.cadastrarLeito);
router.patch('/leito', LeitoController.editarLeito);
router.delete('/leito', LeitoController.apagarLeito);

module.exports = router;