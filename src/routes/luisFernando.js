const express = require('express');
const router = express.Router();

const {
  autenticarToken,
  somenteAdministrador,
  somenteMedico
} = require('../middlewares/auth');

const CidController = require('../controllers/cid');
const LaudoController = require('../controllers/laudo');
const ProcedimentoController = require('../controllers/procedimento');
const EscolhaClinicaController = require('../controllers/escolhaClinica');
const ProcedimentoCidController = require('../controllers/procedimentoCids');

// CID
router.get('/cid', autenticarToken, CidController.listarCid);
router.get('/cid/buscar', autenticarToken, CidController.buscarCid);
router.get('/cid/codigo/:codigo', autenticarToken, CidController.buscarCidPorCodigo);

router.post('/cid', autenticarToken, somenteAdministrador, CidController.cadastrarCid);
router.patch('/cid/:id', autenticarToken, somenteAdministrador, CidController.editarCid);
router.delete('/cid/:id', autenticarToken, somenteAdministrador, CidController.apagarCid);

// LAUDO
router.get('/laudo', autenticarToken, LaudoController.listarLaudo);
router.post('/laudo', autenticarToken, somenteMedico, LaudoController.cadastrarLaudo);
router.patch('/laudo/:id', autenticarToken, somenteMedico, LaudoController.editarLaudo);
router.patch('/laudo/:id/imprimir', autenticarToken, LaudoController.marcarLaudoComoImpresso);
router.delete('/laudo/:id', autenticarToken, somenteAdministrador, LaudoController.apagarLaudo);

// PROCEDIMENTO
router.get('/procedimento', autenticarToken, ProcedimentoController.listarProcedimento);
router.get('/procedimento/buscar', autenticarToken, ProcedimentoController.buscarProcedimento);
router.get('/procedimento/codigo/:codigo', autenticarToken, ProcedimentoController.buscarProcedimentoPorCodigo);

router.post('/procedimento', autenticarToken, somenteAdministrador, ProcedimentoController.cadastrarProcedimento);
router.patch('/procedimento/:id', autenticarToken, somenteAdministrador, ProcedimentoController.editarProcedimento);
router.delete('/procedimento/:id', autenticarToken, somenteAdministrador, ProcedimentoController.apagarProcedimento);

// ESCOLHA CLÍNICA
router.get('/escolha-clinica', autenticarToken, EscolhaClinicaController.listarEscolhaClinica);

router.post('/escolha-clinica', autenticarToken, somenteAdministrador, EscolhaClinicaController.cadastrarEscolhaClinica);
router.patch('/escolha-clinica/:id', autenticarToken, somenteAdministrador, EscolhaClinicaController.editarEscolhaClinica);
router.delete('/escolha-clinica/:id', autenticarToken, somenteAdministrador, EscolhaClinicaController.apagarEscolhaClinica);

// PROCEDIMENTO + CID
router.get('/procedimento-cids', autenticarToken, ProcedimentoCidController.listarProcedimentoCid);
router.get("/procedimento/cid/:cidId", autenticarToken, ProcedimentoCidController.listarProcedimentosPorCid);
router.post('/procedimento-cids', autenticarToken, somenteAdministrador, ProcedimentoCidController.cadastrarProcedimentoCid);
router.patch('/procedimento-cids/:id', autenticarToken, somenteAdministrador, ProcedimentoCidController.editarProcedimentoCid);
router.delete('/procedimento-cids/:id', autenticarToken, somenteAdministrador, ProcedimentoCidController.apagarProcedimentoCid);
module.exports = router;