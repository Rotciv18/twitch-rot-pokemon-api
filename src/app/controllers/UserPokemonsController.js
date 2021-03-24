import {
  willLearnNewMove,
  willEvolve,
  willLearnNewMoveEvolved,
} from '../services/PokemonServices';
import PokemonData from '../schemas/PokemonData';
import MoveData from '../schemas/MoveData';
import Move from '../schemas/Move';
import { getUserPoints, addPoints } from '../services/StreamElements/Points';

const LEVEL_UP_COST = 1000;

class UserPokemonsController {
  async index(req, res) {
    const { pokemonId } = req.params;

    const { user } = req;
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

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

    const userPoints = await getUserPoints(user.username);
    if (userPoints < LEVEL_UP_COST) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    let evolvedTo;
    let learnedMove;

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

          // Aprende novo Move
          user.pokemons.id(pokemonId).moves.id(moveToDelete._id).remove();
          user.pokemons.id(pokemonId).moves.push(newMove);

          learnedMove = newMove.name;
        }
      } else {
        user.pokemons.id(pokemonId).moves.push(newMove);
      }
    }

    const newEvolution = willEvolve(pokemon, newLevel);

    // Nova evolução ao Level-Up
    if (newEvolution) {
      const evolutionPokemonData = await PokemonData.findOne({
        name: newEvolution.name,
      });

      // Pokemon irá aprender novo move ao evoluir
      const newEvolutionMove = willLearnNewMoveEvolved(
        evolutionPokemonData,
        newLevel
      );
      if (pokemon.moves.length === 4) {
        const { deleteMove } = req.query;
        if (!deleteMove) {
          return res.status(400).json({
            message: 'Need to choose a move to delete',
            newEvolutionMove,
            moves: pokemon.moves,
          });
        }

        // Remove o move escolhido para aprender o novo
        if (deleteMove !== 'none') {
          const moveToDelete = pokemon.moves.find(
            (move) => move.name === deleteMove
          );
          if (!moveToDelete) {
            return res.status(400).json({ message: 'Move is not learned yet' });
          }

          // Aprende novo Move
          user.pokemons.id(pokemonId).moves.id(moveToDelete._id).remove();
          user.pokemons.id(pokemonId).moves.push(newEvolutionMove);

          learnedMove = newEvolutionMove.name;
        }
      } else {
        user.pokemons.id(pokemonId).moves.push(newEvolutionMove);
      }

      // Evolui
      user.pokemons.id(pokemonId).pokemon_data = evolutionPokemonData;
      user.pokemons.id(pokemonId).name = evolutionPokemonData.name;

      evolvedTo = evolutionPokemonData.name;
    }

    user.pokemons.id(pokemonId).level = newLevel;
    user.level += 1;

    try {
      await user.save();
      await addPoints(user.username, -LEVEL_UP_COST);
      return res.json({
        pokemon: user.pokemons.id(pokemonId),
        learnedMove,
        evolvedTo,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async learnMove(req, res) {
    // TODO: Checar e cobrar pontos de usuário

    const { user } = req;
    const { pokemonId } = req.params;
    const { moveId } = req.query;
    if (!moveId) {
      return res.status(400).json({ message: 'Move ID is required' });
    }

    const moveData = await MoveData.findById(moveId);
    const newMove = new Move({ name: moveData.moveName });
    let learnedMove;

    const pokemon = user.pokemons.id(pokemonId);
    const canLearn = pokemon.pokemon_data.canLearn.find(
      (move) => move === newMove.name
    );
    if (!canLearn) {
      return res.status(400).json({ message: "Pokemon can't learn this move" });
    }

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

        // Aprende novo Move
        user.pokemons.id(pokemonId).moves.id(moveToDelete._id).remove();
        user.pokemons.id(pokemonId).moves.push(newMove);

        learnedMove = newMove.name;
      }
    } else {
      user.pokemons.id(pokemonId).moves.push(newMove);
    }

    try {
      await user.save();

      return res.json({ pokemon, learnedMove });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserPokemonsController();
