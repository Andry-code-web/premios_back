const express = require('express');
const router = express.Router();
const {
  getGanadores,
} = require('../controllers/ganadores.controller');

router.get('/', getGanadores);

module.exports = router;