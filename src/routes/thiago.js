const express = require('express');
const router = express.Router();

const AtendimentoController = require('../controllers/atendimento');
const ConvenioController = require('../controllers/convenio');
const LeitoController = require('../controllers/leito');

router.get('/atendimento', AtendimentoController.listarAtendimento);
router.post('/atendimento', AtendimentoController.cadastrarAtendimento);
router.patch('/atendimento/:id', AtendimentoController.editarAtendimento);
router.delete('/atendimento/:id', AtendimentoController.apagarAtendimento);

router.get('/convenio', ConvenioController.listarConvenio);
router.post('/convenio', ConvenioController.cadastrarConvenio);
router.patch('/convenio/:id', ConvenioController.editarConvenio);
router.delete('/convenio/:id', ConvenioController.apagarConvenio);

router.get('/leito', LeitoController.listarLeito);
router.post('/leito', LeitoController.cadastrarLeito);
router.patch('/leito/:id', LeitoController.editarLeito);
router.delete('/leito/:id', LeitoController.apagarLeito);

module.exports = router;