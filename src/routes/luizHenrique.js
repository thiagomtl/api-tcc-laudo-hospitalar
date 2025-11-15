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

router.get('/instituicao', InstituicaoController.listarInstituicao);
router.post('/instituicao', InstituicaoController.cadastrarInstituicao);
router.patch('/instituicao', InstituicaoController.editarInstituicao);
router.delete('/instituicao', InstituicaoController.apagarInstituicao);

module.exports = router;

