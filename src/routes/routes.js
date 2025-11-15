const express = require('express');
const router = express.Router();

const thiago = require('./thiago');
const luizHenrique = require('./luizHenrique');
const luizFernando = require('./luisFernando');
const joao = require('./joao');

router.use('/', thiago);
router.use('/', luizHenrique);
router.use('/', luizFernando);
router.use('/', joao);

module.exports = router;