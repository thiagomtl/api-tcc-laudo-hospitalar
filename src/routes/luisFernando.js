const express = require('express');
const router = express.Router();

const LaudoController = require('../controllers/laudo');
router.get('/laudo', LaudoController.listarLaudo);
router.post('/laudo', LaudoController.cadastrarLaudo);
router.patch('/laudo', LaudoController.editarLaudo);
router.delete('/laudo', LaudoController.apagarLaudo);

const CidController = require('../controllers/cid');
router.get('/cid', CidController.listarCid);
router.post('/cid', CidController.cadastrarCid);
router.patch('/cid', CidController.editarCid);
router.delete('/cid', CidController.apagarCid);

const ProcedimentoController = require('../controllers/procedimento');
router.get('/procedimento', ProcedimentoController.listarProcedimento);
router.post('/procedimento', ProcedimentoController.cadastrarProcedimento);
router.patch('/procedimento', ProcedimentoController.editarProcedimento);
router.delete('/procedimento', ProcedimentoController.apagarProcedimento);

const ProcedimentoCidController = require('../controllers/procedimentoCids');
router.get('/procedimento-cids', ProcedimentoCidController.listarProcedimentoCid);
router.post('/procedimento-cids', ProcedimentoCidController.cadastrarProcedimentoCid);
router.patch('/procedimento-cids', ProcedimentoCidController.editarProcedimentoCid);
router.delete('/procedimento-cids', ProcedimentoCidController.apagarProcedimentoCid);

const EscolhaClinicaController = require('../controllers/escolhaClinica');
router.get('/escolha-clinica', EscolhaClinicaController.listarEscolhaClinica);
router.post('/escolha-clinica', EscolhaClinicaController.cadastrarEscolhaClinica);
router.patch('/escolha-clinica', EscolhaClinicaController.editarEscolhaClinica);
router.delete('/escolha-clinica', EscolhaClinicaController.apagarEscolhaClinica);

module.exports = router;