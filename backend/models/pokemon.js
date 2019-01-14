const mongoose = require('mongoose');
const { typeSchema } = require('./types');
const { abilitySchema } = require('./ability');

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    unique: true,
    required: true
  },
  types: [typeSchema],
  abilities: [abilitySchema],
  stats: [{
    name: { type: String, required: true },
    baseStat: { type: Number, required: true }
  }],
  spirits: [
    { url: String }
  ]
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = {
  Pokemon,
  pokemonSchema
}