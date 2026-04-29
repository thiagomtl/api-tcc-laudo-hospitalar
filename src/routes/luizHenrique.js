const express = require('express');
const router = express.Router();
const {autenticarToken, somenteAdministrador} = require('../middlewares/auth');

const MedicoController = require('../controllers/medico');
const UsuarioController = require('../controllers/usuarios');
const FavoritoController = require('../controllers/favoritos');
const InstituicaoController = require('../controllers/instituicao');

router.get('/medicos', MedicoController.listarMedico);
router.post('/medicos', MedicoController.cadastrarMedico);
router.patch('/medicos/:id', MedicoController.editarMedico);
router.delete('/medicos/:id', MedicoController.apagarMedico);

router.get('/usuarios', autenticarToken,somenteAdministrador,UsuarioController.listarUsuario);
router.post('/usuarios', autenticarToken, somenteAdministrador, UsuarioController.cadastrarUsuario);
router.patch('/usuarios/:id', autenticarToken, somenteAdministrador, UsuarioController.editarUsuario);
router.delete('/usuarios/:id', autenticarToken, somenteAdministrador, UsuarioController.apagarUsuario);
router.patch('/usuarios/ocultar/:id', autenticarToken, somenteAdministrador, UsuarioController.ocultarUsuario);
router.patch('/usuarios/ativar/:id', autenticarToken, somenteAdministrador, UsuarioController.ativarUsuario);

router.post('/login', UsuarioController.usuariosLogin);

router.get('/favoritos', FavoritoController.listarFavorito);
router.post('/favoritos', FavoritoController.cadastrarFavorito);
router.patch('/favoritos/:id', FavoritoController.editarFavorito);
router.delete('/favoritos/:id', FavoritoController.apagarFavorito);

router.get('/instituicao', InstituicaoController.listarInstituicao);
router.post('/instituicao', InstituicaoController.cadastrarInstituicao);
router.patch('/instituicao/:id', InstituicaoController.editarInstituicao);
router.delete('/instituicao/:id', InstituicaoController.apagarInstituicao);

module.exports = router;