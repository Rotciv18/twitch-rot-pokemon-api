import { willLearnNewMove, willEvolve } from '../services/PokemonServices';

class UserPokemonsController {
  async index(req, res) {
    const { pokemonId } = req.params;

    const { user } = req;
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    console.log(pokemonId);

    const pokemon = await user.pokemons.id(pokemonId);

    return res.json(pokemon);
  }

  async list(req, res) {
    const { user } = req;
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    return res.json(
      user.pokemons
        .sort((a, b) => a.pokemon_data._id < b.pokemon_data._id)
        .reverse()
    );
  }

  async levelup(req, res) {
    const { user } = req;
    const { pokemonId } = req.params;

    const pokemon = user.pokemons.id(pokemonId);
    if (!pokemon) {
      return res.status(400).json({ message: 'Pokemon not found' });
    }

    const newLevel = pokemon.level + 1;

    const newMove = willLearnNewMove(pokemon, newLevel);

    if (newMove) {
      // Pokemon já tem 4 habilidades?
      if (pokemon.moves.length === 4) {
        const { deleteMove } = req.query;
        if (!deleteMove) {
          return res.status(400).json({
            message: 'Need to choose a move to delete',
            newMove,
            moves: pokemon.moves,
          });
        }

        if (deleteMove !== 'none') {
          const moveToDelete = pokemon.moves.find(
            (move) => move.name === deleteMove
          );
          if (!moveToDelete) {
            return res.status(400).json({ message: 'Move is not learned yet' });
          }

          user.pokemons.id(pokemonId).moves.id(moveToDelete._id).remove();
          user.pokemons.id(pokemonId).moves.push(newMove);
        }
      } else {
        user.pokemons.id(pokemonId).moves.push(newMove);
      }
    }

    const newEvolution = willEvolve(pokemon, newLevel);

    if (newEvolution) {
      // Faz algo para lidar com a evolução
      console.log('VOU EVOLUIR VISSE');
    }

    user.pokemons.id(pokemonId).level = newLevel;

    await user.save();
    return res.json({ pokemon: user.pokemons.id(pokemonId), newMove });
  }
}

export default new UserPokemonsController();
