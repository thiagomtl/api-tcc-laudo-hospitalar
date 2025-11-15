const express = require('express');
const router = express.Router();

const SetorController = require('../controllers/setor');
const CaraterController = require('../controllers/carater');
const PacienteController = require('../controllers/paciente');

router.get('/setor', SetorController.listarSetor);
router.post('/setor', SetorController.cadastrarSetor);
router.patch('/setor', SetorController.editarSetor);
router.delete('/setor', SetorController.apagarSetor);

router.get('/carater', CaraterController.listarCarater);
router.post('/carater', CaraterController.cadastrarCarater);
router.patch('/carater', CaraterController.editarCarater);
router.delete('/carater', CaraterController.apagarCarater);

router.get('/paciente', PacienteController.listarPaciente);
router.post('/paciente', PacienteController.cadastrarPaciente);
router.patch('/paciente', PacienteController.editarPaciente);
router.delete('/paciente', PacienteController.apagarPaciente);

module.exports = router;