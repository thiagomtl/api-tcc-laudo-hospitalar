const express = require('express');
const router = express.Router();

const CidController = require('../controllers/cid');
const LaudoController = require('../controllers/laudo');
const ProcedimentoController = require('../controllers/procedimento');
const EscolhaClinicaController = require('../controllers/escolhaClinica');
const ProcedimentoCidController = require('../controllers/procedimentoCids');

router.get('/cid', CidController.listarCid);
router.post('/cid', CidController.cadastrarCid);
router.patch('/cid/:id', CidController.editarCid);
router.delete('/cid/:id', CidController.apagarCid);

router.get('/laudo', LaudoController.listarLaudo);
router.post('/laudo', LaudoController.cadastrarLaudo);
router.patch('/laudo/:id', LaudoController.editarLaudo);
router.delete('/laudo/:id', LaudoController.apagarLaudo);

router.get('/procedimento', ProcedimentoController.listarProcedimento);
router.post('/procedimento', ProcedimentoController.cadastrarProcedimento);
router.patch('/procedimento/:id', ProcedimentoController.editarProcedimento);
router.delete('/procedimento/:id', ProcedimentoController.apagarProcedimento);

router.get('/escolha-clinica', EscolhaClinicaController.listarEscolhaClinica);
router.post('/escolha-clinica', EscolhaClinicaController.cadastrarEscolhaClinica);
router.patch('/escolha-clinica/:id', EscolhaClinicaController.editarEscolhaClinica);
router.delete('/escolha-clinica/:id', EscolhaClinicaController.apagarEscolhaClinica);

router.get('/procedimento-cids', ProcedimentoCidController.listarProcedimentoCid);
router.post('/procedimento-cids', ProcedimentoCidController.cadastrarProcedimentoCid);
router.patch('/procedimento-cids/:id', ProcedimentoCidController.editarProcedimentoCid);
router.delete('/procedimento-cids/:id', ProcedimentoCidController.apagarProcedimentoCid);

module.exports = router;