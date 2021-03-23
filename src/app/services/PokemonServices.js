export const willLearnNewMove = (pokemon, newLevel) =>
  pokemon.pokemon_data.moves.find((move) => move.learnAt === newLevel);

export const willEvolve = (pokemon, newLevel) =>
  pokemon.pokemon_data.evolutions.find(
    (evolution) => evolution.atLevel === newLevel
  );
