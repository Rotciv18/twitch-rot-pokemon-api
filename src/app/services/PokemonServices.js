import Pokemon from '../models/Pokemon';

export const willLearnNewMove = async (pokemon, newLevel) => {
  const newMove = pokemon.pokemon_data.moves.find(
    (move) => move.learnAt === newLevel
  );

  const alreadyLearned = pokemon.moves.find(
    (move) => move.name === newMove.name
  );

  if (alreadyLearned) {
    return null;
  }

  return newMove;
};

export const willEvolve = async (pokemon, newLevel) =>
  pokemon.pokemon_data.evolutions.find(
    (evolution) => evolution.atLevel === newLevel
  );

export const willLearnNewMoveEvolved = (
  evolutionPokemonData,
  newLevel,
  pokemon
) => {
  const newMove = evolutionPokemonData.moves.find(
    (move) => move.learnAt === newLevel
  );
  if (newMove) {
    const alreadyLearned = pokemon.moves.find(
      (move) => move.name === newMove.name
    );

    if (!alreadyLearned) {
      return newMove;
    }
  }

  return null;
};

export const hasEvolvedPokemon = async (evolution, user) => {
  const hasEvolution = await Pokemon.findOne({
    where: { user_id: user.id, pokemon_data_id: evolution.id },
  });

  if (hasEvolution) {
    return true;
  }
  return false;
};
