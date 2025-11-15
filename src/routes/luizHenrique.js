const express = require('express');
const router = express.Router();

const MedicoController = require('../controllers/medico');
const UsuarioController = require('../controllers/Usuario');
const FavoritoController = require('../controllers/Favorito');
const InstituicaoController = require('../controllers/Instituicao');

router.get('/medicos', MedicoController.listarMedico);
router.post('/medicos', MedicoController.cadastrarMedico);
router.patch('/medicos', MedicoController.editarMedico);
router.delete('/medicos', MedicoController.apagarMedico);

router.get('/usuarios', UsuarioController.listarUsuario);
router.post('/usuarios', UsuarioController.cadastrarUsuario);
router.patch('/usuarios', UsuarioController.editarUsuario);
router.delete('/usuarios', UsuarioController.apagarUsuario);

router.get('/favoritos', FavoritoController.listarFavorito);
router.post('/favoritos', FavoritoController.cadastrarFavorito);
router.patch('/favoritos', FavoritoController.editarFavorito);
router.delete('/favoritos', FavoritoController.apagarFavorito);

router.get('/instituição', InstituicaoController.listarInstituicao);
router.post('/instituição', InstituicaoController.cadastrarInstituicao);
router.patch('/instituição', InstituicaoController.editarInstituicao);
router.delete('/instituição', InstituicaoController.apagarInstituicao);

module.exports = router;

