const mongoose = require('mongoose');
const axios = require('axios');

const { typeSchema, fetchTypesByUrl } = require('./types');
const { abilitySchema } = require('./ability');
const { movementSchema } = require('./movement');

const { API_END_POINT, POKEMON } = require('../utils/constanst');

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
  evolutionChain: [{
    evolveTo: [{ name: {
      type: String,
      required: true
    }}],
    evolutionType: { type: String, required: true }
  }],
  movements: [movementSchema],
  stats: [{
    name: { type: String, required: true },
    baseStat: { type: Number, required: true }
  }],
  spirits: [
    { url: String }
  ]
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

async function getPokemonByName(pokemonName, res) {
  const url = API_END_POINT + POKEMON + pokemonName + '/';
  const { data } = await axios.get(url);
  const { types } = data;
  const typesUrl = [];
  types.forEach( (elementData) => {
   typesUrl.push(elementData.type.url);
  });
  const promiseTypesArray = fetchTypesByUrl(typesUrl);
  const result = await Promise.all(promiseTypesArray);
  const typesObjects = [];
  result.forEach( el => {
    const {  name, damage_relations } = el;
    const { double_damage_from, double_damage_to, half_damage_from, half_damage_to, no_damage_from, no_damage_to } = damage_relations;
    const typeObj = {
      name,
      damageRelations: {
        doubleDamageFrom: double_damage_from.map(({ name}) => { return { name } } ),
        doubleDamageTo: double_damage_to.map(({ name }) => { return { name } } ),
        halfDamageFrom: half_damage_from.map(({ name }) => { return { name } } ),
        noDamageFrom: no_damage_from.map(({ name }) => { return { name } } ),
        noDamageTo: no_damage_to.map(({ name }) => { return { name } } )
      }
    }
    console.log(typeObj);
    typesObjects.push(typeObj);
  });
  res.send(typesObjects);
}

module.exports = {
  Pokemon,
  pokemonSchema,
  getPokemonByName
}