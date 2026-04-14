const express = require('express');
const router = express.Router();

const SetorController = require('../controllers/setor');
const CaraterController = require('../controllers/carater');
const PacienteController = require('../controllers/paciente');

router.get('/setor', SetorController.listarSetor);
router.post('/setor', SetorController.cadastrarSetor);
router.patch('/setor/:id', SetorController.editarSetor);
router.delete('/setor/:id', SetorController.apagarSetor);

router.get('/carater', CaraterController.listarCarater);
router.post('/carater', CaraterController.cadastrarCarater);
router.patch('/carater/:id', CaraterController.editarCarater);
router.delete('/carater/:id', CaraterController.apagarCarater);

router.get('/paciente', PacienteController.listarPaciente);
router.post('/paciente', PacienteController.cadastrarPaciente);
router.patch('/paciente/:id', PacienteController.editarPaciente);
router.delete('/paciente/:id', PacienteController.apagarPaciente);

module.exports = router;