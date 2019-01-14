const express = require('express');
const router = express.Router();
const { getPokemonByName } = require('../models/pokemon');

router.get('/:name', (req, res) => {
  const { name } = req.params;
  getPokemonByName(name, res);
})

module.exports = router;