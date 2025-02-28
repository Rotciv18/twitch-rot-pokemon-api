import axios from 'axios';
import PokemonData from '../app/models/PokemonData';

const baseUrl = 'https://pokeapi.co/api/v2';
const lastPokemon = 151;

async function getPokemonEvolutionData(evoChain, pokemonName) {
  let evolutions = [];

  // Espécie encontrada
  if (evoChain.species.name === pokemonName && evoChain.evolves_to.length > 0) {
    const promises = evoChain.evolves_to.map(async (evolution) => {
      const pokeEvolution = await axios.get(
        `${baseUrl}/pokemon/${evolution.species.name}`
      );
      evolutions.push({
        id: pokeEvolution.data.id,
        name: evolution.species.name,
        atLevel: evolution.evolution_details[0].min_level,
        trigger: evolution.evolution_details[0].trigger.name,
        withItem: evolution.evolution_details[0].item
          ? evolution.evolution_details[0].item.name
          : null,
      });
    });
    await Promise.all(promises);

    return evolutions;
  }

  if (evoChain.evolves_to.length < 1) {
    return false;
  }

  for (let i = 0; i < evoChain.evolves_to.length; i++) {
    evolutions = getPokemonEvolutionData(evoChain.evolves_to[i], pokemonName);

    if (evolutions) return evolutions;
  }

  return false;
}

function getPokemonMoves(pokemon) {
  const moves = [];
  pokemon.moves.forEach((move) => {
    const versionGroupDetails = move.version_group_details.find(
      (vgd) =>
        vgd.move_learn_method.name === 'level-up' &&
        vgd.version_group.name === 'red-blue'
    );
    if (!versionGroupDetails) {
      return;
    }

    const levelLearnedAt = versionGroupDetails.level_learned_at;

    moves.push({ name: move.move.name, learnAt: levelLearnedAt });
  });
  return moves;
}

function getCanLearnMoves(pokemon) {
  let moves = '';
  pokemon.moves.forEach((move) => {
    move.version_group_details.every((vgd) => {
      if (vgd.version_group.name === 'red-blue') {
        moves += `;${move.move.name}`;
        return false;
      }
      return true;
    });
  });

  return moves;
}

export default async () => {
  const indexes = [];
  for (let i = 1; i <= lastPokemon; i++) {
    indexes.push(i);
  }
  const promises = indexes.map(async (i) => {
    // console.log(i);

    const pokemonSpecieResponse = await axios.get(
      `${baseUrl}/pokemon-species/${i}`
    );
    const pokemonSpecie = pokemonSpecieResponse.data;

    let pokemonResponse;
    try {
      pokemonResponse = await axios.get(`${baseUrl}/pokemon/${i}/`);
    } catch (e) {
      pokemonResponse = await axios.get(`${baseUrl}/pokemon/${i}`);
    }
    const pokemon = pokemonResponse.data;

    const newPokemon = {
      id: pokemonSpecie.id,
      name: pokemonSpecie.name,
      sprite: pokemon.sprites.front_default,
    };

    const evolutionChainResponse = await axios.get(
      pokemonSpecie.evolution_chain.url
    );
    const evolutionChain = evolutionChainResponse.data.chain;

    const evolutionData = await getPokemonEvolutionData(
      evolutionChain,
      pokemonSpecie.name
    );
    if (evolutionData) {
      Object.assign(newPokemon, { evolutions: evolutionData });
    }

    newPokemon.moves = getPokemonMoves(pokemon);
    newPokemon.can_learn = getCanLearnMoves(pokemon);

    await PokemonData.create(newPokemon);
  });

  await Promise.all(promises);
  console.log('cabou');
};
