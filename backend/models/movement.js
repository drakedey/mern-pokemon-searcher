const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  descriptions: [{
    text: { type: String },
    language: { type: String }
  }]
});

const Movement = mongoose.model('Movement', movementSchema);

module.exports = {
  Movement,
  movementSchema
}