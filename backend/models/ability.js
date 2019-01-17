const mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema({
  name: { type: String,  required: true },
  effectDescription: { type: String, required: true }
});

const Ability = mongoose.model('Ability', abilitySchema);

module.exports = {
  Ability,
  abilitySchema
}