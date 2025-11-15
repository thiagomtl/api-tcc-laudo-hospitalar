const express = require('express');
const router = express.Router();

const thiago = require('./thiago');
const luizHenrique = require('./luizHenrique');
const luizFernando = require('./luisFernando');

router.use('/', thiago);
router.use('/', luizHenrique);
router.use('/', luizFernando);

module.exports = router;