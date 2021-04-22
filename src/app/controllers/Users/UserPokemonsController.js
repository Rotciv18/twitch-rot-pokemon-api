import {
  willLearnNewMove,
  willEvolve,
  willLearnNewMoveEvolved,
  hasEvolvedPokemon,
} from '../../services/PokemonServices';
import PokemonData from '../../models/PokemonData';
import MoveData from '../../models/MoveData';
import Pokemon from '../../models/Pokemon';
import { getUserPoints, addPoints } from '../../services/StreamElements/Points';

import twitchClient from '../../../twitchClient';
import { triggerAlert } from '../../services/StreamLabs/Alerts';
import { giftPokemon } from '../../services/Twitch/twitchServices';

const LEVEL_UP_COST = 1000;

class UserPokemonsController {
  async index(req, res) {
    const { pokemonId } = req.params;

    const { user } = req;
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const pokemon = await Pokemon.findByPk(pokemonId);

    return res.json(pokemon);
  }

  async list(req, res) {
    const { user } = req;
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const pokemons = await Pokemon.findAll({
      where: { user_id: user.id },
      include: 'pokemon_data',
      order: [['pokemon_data', 'id', 'asc']],
    });

    return res.json(pokemons);
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

    const pokemon = await Pokemon.findByPk(pokemonId, {
      include: 'pokemon_data',
    });
    if (!pokemon) {
      return res.status(400).json({ message: 'Pokemon not found' });
    }

    const newLevel = pokemon.level + 1;

    const newMove = await willLearnNewMove(pokemon, newLevel);

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
          const remainingMoves = [];
          pokemon.moves.forEach((move) => {
            if (move.name !== moveToDelete.name) remainingMoves.push(move);
          });
          pokemon.moves = [...remainingMoves, newMove];

          learnedMove = newMove.name;
        }
      } else {
        learnedMove = newMove.name;
        pokemon.moves = [...pokemon.moves, newMove];
      }
    }

    const newEvolution = await willEvolve(pokemon, newLevel);

    // Nova evolução ao Level-Up
    if (newEvolution && !hasEvolvedPokemon(newEvolution, user)) {
      const evolutionPokemonData = await PokemonData.findOne({
        name: newEvolution.name,
      });

      // Pokemon irá aprender novo move ao evoluir
      const newEvolutionMove = willLearnNewMoveEvolved(
        evolutionPokemonData,
        newLevel
      );
      if (newEvolutionMove) {
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
              return res
                .status(400)
                .json({ message: 'Move is not learned yet' });
            }

            // Learns new Move
            const remainingMoves = [];
            pokemon.moves.forEach((move) => {
              if (move.name !== moveToDelete.name) {
                remainingMoves.push(move);
              }
            });
            pokemon.moves = [...remainingMoves, newEvolutionMove];

            learnedMove = newEvolutionMove.name;
          }
        } else {
          pokemon.moves = [...pokemon.moves, newEvolutionMove];
        }
      }

      // Evolves
      pokemon.pokemon_data_id = newEvolution.id;
      pokemon.name = newEvolution.name;

      evolvedTo = newEvolution.name;

      // Gift pokemon to user
      await giftPokemon(user.username, newEvolution.name);
    }

    pokemon.level = newLevel;
    user.level += 1;

    try {
      await pokemon.save();
      await user.save();
      await addPoints(user.username, -LEVEL_UP_COST);
      return res.json({
        pokemon: {
          name: pokemon.name,
          level: pokemon.level,
          moves: pokemon.moves,
        },
        learnedMove,
        evolvedTo,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async learnMove(req, res) {
    // TODO: Checar e cobrar pontos de usuário

    const { pokemonId } = req.params;
    const { moveId } = req.query;
    if (!moveId) {
      return res.status(400).json({ message: 'Move ID is required' });
    }

    const moveData = await MoveData.findByPk(moveId);
    const newMove = { name: moveData.move_name, learnAt: 1 };
    let learnedMove;

    const pokemon = await Pokemon.findByPk(pokemonId, {
      include: 'pokemon_data',
    });
    const canLearn = pokemon.pokemon_data.can_learn.find(
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
        const remainingMoves = [];
        pokemon.moves.forEach((move) => {
          if (move.name !== moveToDelete.name) remainingMoves.push(move);
        });
        pokemon.moves = [...remainingMoves, newMove];

        learnedMove = newMove.name;
      }
    } else {
      pokemon.moves = [...pokemon.moves, newMove];
    }

    try {
      await pokemon.save();

      return res.json({
        pokemon: {
          name: pokemon.name,
          level: pokemon.level,
          moves: pokemon.moves,
        },
        learnedMove,
      });
    } catch (error) {
      return res.json(error);
    }
  }
}

export default new UserPokemonsController();
