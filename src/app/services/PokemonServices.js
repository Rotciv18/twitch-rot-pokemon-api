import Pokemon from '../models/Pokemon';

export const willLearnNewMove = async (pokemon, newLevel) =>
  pokemon.pokemon_data.moves.find((move) => move.learnAt === newLevel);

export const willEvolve = async (pokemon, newLevel) =>
  pokemon.pokemon_data.evolutions.find(
    (evolution) => evolution.atLevel === newLevel
  );

export const willLearnNewMoveEvolved = (evolutionPokemonData, newLevel) =>
  evolutionPokemonData.moves.find((move) => move.learnAt === newLevel);

export const hasEvolvedPokemon = async (evolution, user) => {
  const hasEvolution = await Pokemon.findOne({
    where: { user_id: user.id, id: evolution.id },
  });

  if (hasEvolution) {
    return true;
  }
  return false;
};
