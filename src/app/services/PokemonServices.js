import PokemonData from '../schemas/PokemonData';

export const willLearnNewMove = async (pokemon, newLevel) => {
  const pokemonData = await PokemonData.findById(pokemon.pokemon_data_id);
  return pokemonData.moves.find((move) => move.learnAt === newLevel);
};

export const willEvolve = async (pokemon, newLevel) => {
  const pokemonData = await PokemonData.findById(pokemon.pokemon_data_id);
  return pokemonData.evolutions.find(
    (evolution) => evolution.atLevel === newLevel
  );
};

export const willLearnNewMoveEvolved = (evolutionPokemonData, newLevel) =>
  evolutionPokemonData.moves.find((move) => move.learnAt === newLevel);
