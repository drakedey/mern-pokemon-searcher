const mongoose = require('mongoose');
const axios = require('axios');

const { typeSchema } = require('./types');
const { abilitySchema } = require('./ability');
const { movementSchema } = require('./movement');

const {
  API_END_POINT,
  POKEMON,
  POKEMON_E,
  API_SHOWDOWN_END_POINT,
  P_BACK,
  P_BACK_SHINY,
  P_FRONT,
  P_FRONT_SHINY
} = require('../utils/constanst');
const { getPromisesByUrls } = require('../utils/shared_functions');

const evolutionEschema = new mongoose.Schema({
  evolutionType: { type: String, required: true },
  evolutionName: { type: String, required: true }
})

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
  color: { type: String, default: 'red' },
  types: [typeSchema],
  abilities: [abilitySchema],
  evolutionChain: [evolutionEschema],
  movements: [movementSchema],
  stats: [{
    name: { type: String, required: true },
    baseStat: { type: Number, required: true }
  }],
  spirits: [
    { 
      urlBack: String,
      urlFront: String,
      urlBackShyni: String,
      urlFrontShiny: String
    }
  ]
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

async function getPokemonByName(pokemonName, res) {
  const urlPokemon = API_END_POINT + POKEMON + pokemonName + '/';
  const urlPokemonSpecie = API_END_POINT + POKEMON_E + pokemonName + '/';
  const [{data:pokemon}, {data:specie}] = await axios.all([
    axios.get(urlPokemon),
    axios.get(urlPokemonSpecie)
  ]);
  const { types, abilities, name, id, stats, moves } = pokemon;
  const { color: { name:color }, evolution_chain: { url } } = specie;
  const typeUrls = types.map( ({ type }) => type.url);
  const abilitieUrls = abilities.map( ({ ability }) => ability.url );
  const movementUrls = moves.map( ({ move }) => move.url);
  const promiseAbilityUrl = getPromisesByUrls(abilitieUrls);
  const promiseTypesArray = getPromisesByUrls(typeUrls);
  const promiseMovementsArray = getPromisesByUrls(movementUrls);

  //assambling typeObj Array
  const typeResult = await Promise.all(promiseTypesArray);
  const typesObjects = typeResult.map(({ name, damage_relations }) => {
    const { double_damage_from, double_damage_to, half_damage_from, half_damage_to, no_damage_from, no_damage_to } = damage_relations;
    return {
      name,
      damageRelations: {
        doubleDamageFrom: double_damage_from.map(({ name }) => ({ name }) ),
        doubleDamageTo: double_damage_to.map(({ name }) => ({ name }) ),
        halfDamageTo: half_damage_to.map(({ name }) => ({ name })),
        halfDamageFrom: half_damage_from.map(({ name }) => ({ name }) ),
        noDamageFrom: no_damage_from.map(({ name }) => ({ name }) ),
        noDamageTo: no_damage_to.map(({ name }) => ({ name }) )
      }
    }
  });

  //assambling abilityObj Array
  const abilityResult = await Promise.all(promiseAbilityUrl);
  const abilityObj = abilityResult.map(({name, effect_entries:[{ short_effect }]}) => {
    return {
      name,
      description: short_effect
    };
  })

  //assambling stats
  const statsObj = stats.map(({ base_stat, stat: { name } }) => {
    return {
      name,
      baseStat: base_stat
    }
  })

  //assambling evolutionChain
  const { data: { chain: { evolves_to:evolutionData } } } = await axios.get(url);
  const evolutionObject = evolutionData.map((data) => {
    const parseEvolutionType = (evolType) => {
      switch (evolType) {
        case 'use-item':
          return 'Use Item';
        case 'level-up':
          return 'Level Up';
        case 'trade':
          return 'Trade';
        default:
          break;
      }
    }
    let { species: { name:evolutionName }, evolution_details: [{ trigger: { name:evolutionType } }] } = data;
    evolutionType = parseEvolutionType(evolutionType);
    return { evolutionName, evolutionType };
  });
  const verifyImageDisponibility = async (url, type) => {
    const { status } = await axios.get(url);
    if(status !== 200) {
      const { sprites } = pokemon;
      return sprites[type];
    }
    return url;
  }

  //Assambling Spirites
  const spirits = {
    urlBack: await verifyImageDisponibility(API_SHOWDOWN_END_POINT + P_BACK + name + '.gif', 'back_default'),
    urlFront: await verifyImageDisponibility(API_SHOWDOWN_END_POINT + P_FRONT + name + '.gif', 'front_default'),
    urlBackShyni: await verifyImageDisponibility(API_SHOWDOWN_END_POINT + P_BACK_SHINY + name + '.gif', 'front_shiny'),
    urlFrontShiny: await verifyImageDisponibility(API_SHOWDOWN_END_POINT + P_FRONT_SHINY + name + '.gif', 'back_shiny')
  }

  //Assambling Movements
  const movementResult = await Promise.all(promiseMovementsArray);
  const movementObject = movementResult.map((move) => {
    const {
      accuracy,
      names,
      power,
      pp:PP,
      flavor_text_entries,
      damage_class,
      type
    } = move;
    const { name } = names.find((nameEl) => nameEl.language.name === 'en');
    const basePower = power ? power : 0;
    const { flavor_text:description } = flavor_text_entries.find((text) => text.language.name === 'en');
    const { name:movementType } = type;
    const { name:damageType } = damage_class;
    return { name,  basePower, PP, description, movementType, damageType, accuracy }
  })


  const pokemonObj = {
    name,
    id,
    color,
    types: typesObjects,
    abilities: abilityObj,
    evolutionChain: evolutionObject,
    movements: movementObject,
    stats: statsObj,
    spirits
  }
  res.send(pokemonObj);
}

module.exports = {
  Pokemon,
  pokemonSchema,
  getPokemonByName
}