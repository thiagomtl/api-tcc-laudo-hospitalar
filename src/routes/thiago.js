const express = require('express');
const router = express.Router();

// const { autenticarToken } = require('../middlewares/auth');

const AtendimentoController = require('../controllers/atendimento');
const ConvenioController = require('../controllers/convenio');
const LeitoController = require('../controllers/leito');
const LogsAcaoController = require("../controllers/logsAcao");
const IntegracaoController = require('../controllers/integracao');

router.get('/atendimento', AtendimentoController.listarAtendimento);
router.get('/atendimento/listar-atend', AtendimentoController.listarAtend); // rota extra para obter lista ascendente de IDs
router.get('/atendimento/pendentes', AtendimentoController.listarAtendimentosPendentes);
router.post('/atendimento', AtendimentoController.cadastrarAtendimento);
router.patch('/atendimento/:id', AtendimentoController.editarAtendimento);
router.delete('/atendimento/:id', AtendimentoController.apagarAtendimento);

router.post('/integracao/atendimento-pendente', IntegracaoController.criarAtendimentoPendente);

router.get('/convenio', ConvenioController.listarConvenio);
router.post('/convenio', ConvenioController.cadastrarConvenio);
router.patch('/convenio/:id', ConvenioController.editarConvenio);
router.delete('/convenio/:id', ConvenioController.apagarConvenio);

router.get('/leito', LeitoController.listarLeito);
router.post('/leito', LeitoController.cadastrarLeito);
router.patch('/leito/:id', LeitoController.editarLeito);
router.delete('/leito/:id', LeitoController.apagarLeito);

module.exports = router;
