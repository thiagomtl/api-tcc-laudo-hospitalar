const express = require('express');
const router = express.Router();

const MedicoController = require('../controllers/medico');
const UsuarioController = require('../controllers/usuarios');
const FavoritoController = require('../controllers/favoritos');
const InstituicaoController = require('../controllers/instituicao');

router.get('/medicos', MedicoController.listarMedico);
router.post('/medicos', MedicoController.cadastrarMedico);
router.patch('/medicos/:id', MedicoController.editarMedico);
router.delete('/medicos/:id', MedicoController.apagarMedico);

router.get('/usuarios', UsuarioController.listarUsuario);
router.post('/usuarios', UsuarioController.cadastrarUsuario);
router.patch('/usuarios/:id', UsuarioController.editarUsuario);
router.delete('/usuarios/:id', UsuarioController.apagarUsuario);
router.patch('/usuarios/del/:id', UsuarioController.ocultarUsuario);

// login como POST para receber email e senha no body
router.post('/login', UsuarioController.loginUsuario);

router.get('/favoritos', FavoritoController.listarFavorito);
router.post('/favoritos', FavoritoController.cadastrarFavorito);
router.patch('/favoritos/:id', FavoritoController.editarFavorito);
router.delete('/favoritos/:id', FavoritoController.apagarFavorito);

router.get('/instituicao', InstituicaoController.listarInstituicao);
router.post('/instituicao', InstituicaoController.cadastrarInstituicao);
router.patch('/instituicao/:id', InstituicaoController.editarInstituicao);
router.delete('/instituicao/:id', InstituicaoController.apagarInstituicao);

module.exports = router;