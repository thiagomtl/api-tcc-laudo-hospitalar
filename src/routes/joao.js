const express = require('express');
const router = express.Router();

const {
  autenticarToken,
  somenteAdministrador
} = require('../middlewares/auth');

const SetorController = require('../controllers/setor');
const CaraterController = require('../controllers/carater');
const PacienteController = require('../controllers/paciente');

// SETOR
router.get('/setor', autenticarToken, SetorController.listarSetor);
router.post('/setor', autenticarToken, somenteAdministrador, SetorController.cadastrarSetor);
router.patch('/setor/:id', autenticarToken, somenteAdministrador, SetorController.editarSetor);
router.delete('/setor/:id', autenticarToken, somenteAdministrador, SetorController.apagarSetor);

// CARÁTER
router.get('/carater', autenticarToken, CaraterController.listarCarater);
router.post('/carater', autenticarToken, somenteAdministrador, CaraterController.cadastrarCarater);
router.patch('/carater/:id', autenticarToken, somenteAdministrador, CaraterController.editarCarater);
router.delete('/carater/:id', autenticarToken, somenteAdministrador, CaraterController.apagarCarater);

// PACIENTE
router.get('/paciente', autenticarToken, PacienteController.listarPaciente);
router.post('/paciente', autenticarToken, PacienteController.cadastrarPaciente);
router.patch('/paciente/:id', autenticarToken, PacienteController.editarPaciente);
router.delete('/paciente/:id', autenticarToken, somenteAdministrador, PacienteController.apagarPaciente);

module.exports = router;