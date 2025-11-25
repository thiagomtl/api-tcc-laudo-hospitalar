const express = require('express');
const router = express.Router();

const MedicoController = require('../controllers/medico');
const UsuarioController = require('../controllers/Usuario');
const FavoritoController = require('../controllers/Favorito');
const InstituicaoController = require('../controllers/Instituicao');

router.get('/medicos', MedicoController.listarMedico);
router.post('/medicos', MedicoController.cadastrarMedico);
router.patch('/medicos/:id', MedicoController.editarMedico);
router.delete('/medicos/:id', MedicoController.apagarMedico);

router.get('/usuarios', UsuarioController.listarUsuario);
router.post('/usuarios', UsuarioController.cadastrarUsuario);
router.patch('/usuarios/:id', UsuarioController.editarUsuario);
router.delete('/usuarios/:id', UsuarioController.apagarUsuario);

router.get('/favoritos', FavoritoController.listarFavorito);
router.post('/favoritos', FavoritoController.cadastrarFavorito);
router.patch('/favoritos/:id', FavoritoController.editarFavorito);
router.delete('/favoritos/:id', FavoritoController.apagarFavorito);

router.get('/instituicao', InstituicaoController.listarInstituicao);
router.post('/instituicao', InstituicaoController.cadastrarInstituicao);
router.patch('/instituicao/:id', InstituicaoController.editarInstituicao);
router.delete('/instituicao/:id', InstituicaoController.apagarInstituicao);

module.exports = router;

