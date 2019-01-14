const mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema({
  descriptions: [{
    text: { type: String },
    language: { type: String }
  }]
});

const Ability = mongoose.model('Ability', abilitySchema);

module.exports = {
  Ability,
  abilitySchema
}