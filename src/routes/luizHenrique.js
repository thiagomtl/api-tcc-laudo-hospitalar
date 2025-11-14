const express = require('express');
const router = express.Router();

const MedicoController = require('../controllers/medico');
const UsuarioController = require('../controllers/Usuario');
const FavoritoController = require('../controllers/Favorito');
const InstituicaoController = require('../controllers/Instituicao');

router.get('/medicos', MedicoController.listarMedico);
router.get('/medicos', MedicoController.cadastrarMedico);
router.get('/medicos', MedicoController.editarMedico);
router.get('/medicos', MedicoController.apagarMedico);

router.get('/usuarios', UsuarioController.listarUsuario);
router.get('/usuarios', UsuarioController.cadastrarUsuario);
router.get('/usuarios', UsuarioController.editarUsuario);
router.get('/usuarios', UsuarioController.apagarUsuario);

router.get('/favoritos', FavoritoController.listarFavorito);
router.get('/favoritos', FavoritoController.cadastrarFavorito);
router.get('/favoritos', FavoritoController.editarFavorito);
router.get('/favoritos', FavoritoController.apagarFavorito);

router.get('/instituição', InstituicaoController.listarInstituicao);
router.get('/instituição', InstituicaoController.cadastrarInstituicao);
router.get('/instituição', InstituicaoController.editarInstituicao);
router.get('/instituição', InstituicaoController.apagarInstituicao);

module.exports = router;

