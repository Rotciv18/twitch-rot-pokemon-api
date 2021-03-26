import axios from 'axios';
import PokemonData from '../app/schemas/PokemonData';

const baseUrl = 'https://pokeapi.co/api/v2';
const lastPokemon = 151;

function getPokemonEvolutionData(evoChain, pokemonName) {
  let evolutions = [];

  // Espécie encontrada
  if (evoChain.species.name === pokemonName && evoChain.evolves_to.length > 0) {
    evoChain.evolves_to.forEach((evolution) => {
      evolutions.push({
        name: evolution.species.name,
        atLevel: evolution.evolution_details[0].min_level,
        trigger: evolution.evolution_details[0].trigger.name,
        withItem: evolution.evolution_details[0].item
          ? evolution.evolution_details[0].item.name
          : null,
      });
    });

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
    const levelLearnedAt =
      move.version_group_details.length > 1
        ? move.version_group_details[1].level_learned_at
        : 0;
    if (levelLearnedAt > 0) {
      moves.push({ name: move.move.name, learnAt: levelLearnedAt });
    }
  });
  return moves;
}

function getCanLearnMoves(pokemon) {
  const moves = [];
  pokemon.moves.forEach((move) => {
    move.version_group_details.every((vgd) => {
      if (vgd.version_group.name === 'red-blue') {
        moves.push(move.move.name);
        return false;
      }
      return true;
    });
  });

  return moves;
}

export default async () => {
  for (let i = 1; i <= lastPokemon; i++) {
    console.log(i);

    const pokemonSpecieResponse = await axios.get(
      `${baseUrl}/pokemon-species/${i}`
    );
    const pokemonSpecie = pokemonSpecieResponse.data;

    const pokemonResponse = await axios.get(`${baseUrl}/pokemon/${i}/`);
    const pokemon = pokemonResponse.data;

    const newPokemon = {
      pokedex_id: pokemonSpecie.id,
      name: pokemonSpecie.name,
      sprite: pokemon.sprites.front_default,
    };

    const evolutionChainResponse = await axios.get(
      pokemonSpecie.evolution_chain.url
    );
    const evolutionChain = evolutionChainResponse.data.chain;

    const evolutionData = getPokemonEvolutionData(
      evolutionChain,
      pokemonSpecie.name
    );
    if (evolutionData) {
      Object.assign(newPokemon, { canEvolve: true, evolutions: evolutionData });
    }

    newPokemon.moves = getPokemonMoves(pokemon);
    newPokemon.canLearn = getCanLearnMoves(pokemon);

    await PokemonData.create(newPokemon);
  }
};
