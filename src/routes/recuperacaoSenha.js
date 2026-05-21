const express = require('express');
const router = express.Router();

const RecuperacaoSenhaController = require('../controllers/recuperacaoSenha');

router.post('/recuperar-senha/usuario', RecuperacaoSenhaController.buscarUsuario);
router.post('/recuperar-senha/codigo', RecuperacaoSenhaController.enviarCodigo);
router.post('/recuperar-senha/validar-codigo', RecuperacaoSenhaController.validarCodigo);
router.patch('/recuperar-senha', RecuperacaoSenhaController.redefinirSenha);

module.exports = router;
