const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  damageRelations: {
    doubleDamageFrom: [{ name: {
    type: String,
    required: true
  }}],
    doubleDamageTo: [{ name: {
    type: String,
    required: true
  }}],
    halfDamageTo: [{ name: {
    type: String,
    required: true
  }}],
    halfDamageFrom: [{ name: {
    type: String,
    required: true
  }}],
    noDamageFrom: [{ name: {
    type: String,
    required: true
  }}],
    noDamageTo: { 
      type: [{ name: {
    type: String,
    required: true
  }}],
    }
  }
});

const Type = mongoose.model('Type', typeSchema);

module.exports = {
  Type,
  typeSchema
}