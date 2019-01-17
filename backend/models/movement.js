const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePower: { type: Number, default: 0 },
  PP: { type: Number, required: true },
  description: { type: String, required: true },
  movementType: { type: String, required: true },
  damageType:  { type: String, required: true },
  accuracy: { type: Number, required: true }
});

const Movement = mongoose.model('Movement', movementSchema);

module.exports = {
  Movement,
  movementSchema
}