const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  damageRelations: {
    doubleDamageFrom: [typeSchema],
    doubleDamageTo: [typeSchema],
    halfDamageTo: [typeSchema],
    halfDamageFrom: [typeSchema],
    noDamageFrom: [typeSchema],
    noDamageTo: { 
      type: [typeSchema],
    }
  }
});

const Type = mongoose.model('Type', typeSchema);

module.exports = {
  Type,
  typeSchema
}