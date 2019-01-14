const mongoose = require('mongoose');
const axios = require('axios');

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

function fetchTypesByUrl(urlArray) {
  const majorPromise = [];
  urlArray.forEach(url => {
    majorPromise.push(new Promise((res, rej) => {
      axios.get(url)
      .then(response => res(response.data))
      .catch(err => rej(err))
    }));
  });
  return majorPromise;
}

const Type = mongoose.model('Type', typeSchema);

module.exports = {
  Type,
  typeSchema,
  fetchTypesByUrl
}