import { Op } from 'sequelize';
import PokemonData from '../../models/PokemonData';
import MoveData from '../../models/MoveData';
import Pokemon from '../../models/Pokemon';
import Stone from '../../models/Stone';
import { canLevelUpOrEvolve } from '../../services/UserServices';

import {
  willLearnNewMove,
  willEvolve,
  willLearnNewMoveEvolved,
  hasEvolvedPokemon,
} from '../../services/PokemonServices';
import { getUserPoints, addPoints } from '../../services/StreamElements/Points';
import { triggerAlert } from '../../services/StreamLabs/Alerts';
import {
  giftPokemon,
  removePokemon,
} from '../../services/Twitch/twitchServices';

import alertConstants from '../../../config/alertConstants';
import capitalize from '../../../helpers/capitalize';

const LEVEL_UP_COST = 1000;

function pokemonsSetupWhereQuery(setup, userId) {
  if (setup === undefined || setup === null) {
    return {
      user_id: userId,
    };
  }
  return {
    user_id: userId,
    setup_id: setup === false ? { [Op.ne]: null } : null,
  };
}

function pokemonsCanLearnWhereQuery(canLearn) {
  if (canLearn) {
    return {
      '$pokemon_data.can_learn$': {
        [Op.substring]: canLearn,
      },
    };
  }

  return null;
}

class UserPokemonsController {
  async index(req, res) {
    const { pokemonId } = req.params;

    const { user } = req;
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const pokemon = await Pokemon.findByPk(pokemonId, {
      include: {
        model: PokemonData,
        as: 'pokemon_data',
        attributes: ['sprite'],
      },
    });

    return res.json(pokemon);
  }

  async list(req, res) {
    const { user } = req;
    const { evolvesWithStone, canLearn } = req.query;

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const { setup } = req.query;
    let pokemons = await Pokemon.findAll({
      include: {
        model: PokemonData,
        as: 'pokemon_data',
        attributes: ['sprite', 'evolutions'],
      },
      where: {
        ...pokemonsSetupWhereQuery(setup, user.id),
        ...pokemonsCanLearnWhereQuery(canLearn),
      },
      order: [['level', 'desc']],
      attributes: ['id', 'level', 'name', 'moves'],
    });

    if (evolvesWithStone) {
      pokemons = pokemons.filter((pokemon) => {
        let canEvolve = false;
        pokemon.pokemon_data.evolutions.forEach((evolution) => {
          if (evolution.withItem === evolvesWithStone) {
            canEvolve = true;
          }
        });
        return canEvolve;
      });
    }

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
      include: ['pokemon_data', 'setup'],
    });
    if (!pokemon) {
      return res.status(400).json({ message: 'Pokemon not found' });
    }
    if (user.position && pokemon.setup) {
      return res
        .status(401)
        .json({ message: "Can't level up pokemon that's in position Setup" });
    }

    const [canLevelUp, reason] = await canLevelUpOrEvolve(user, pokemon);

    if (!canLevelUp) {
      return res
        .status(401)
        .json({ message: `User have one ${reason}`, hasOne: reason });
    }

    const newLevel = pokemon.level + 1;

    const newMove = await willLearnNewMove(pokemon, newLevel);

    if (newMove) {
      // Pokemon já tem 4 habilidades?
      if (pokemon.moves.length === 4) {
        const { deleteMove } = req.query;
        if (!deleteMove) {
          return res.status(300).json({
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
    let previousPokemon;
    let evolutionPokemonData;
    if (newEvolution && !(await hasEvolvedPokemon(newEvolution, user))) {
      previousPokemon = pokemon.name;
      evolutionPokemonData = await PokemonData.findOne({
        where: { name: newEvolution.name },
      });

      // Pokemon irá aprender novo move ao evoluir
      const newEvolutionMove = willLearnNewMoveEvolved(
        evolutionPokemonData,
        newLevel,
        pokemon
      );
      if (newEvolutionMove) {
        if (pokemon.moves.length === 4) {
          const { deleteMove } = req.query;
          if (!deleteMove) {
            return res.status(300).json({
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

      // Gift pokemon to user
      await giftPokemon(user.username, newEvolution.name);
      await removePokemon(user.username, pokemon.name);
      triggerAlert({
        type: 'follow',
        message: `${capitalize(user.username)} evoluiu seu ${capitalize(
          pokemon.name
        )} para um ${capitalize(newEvolution.name)}`,
        image_href: alertConstants.pokemonEvolveGifUrl,
        sound_href: alertConstants.pokemonEvolvedSoundUrl,
        duration: 3500,
      });

      // Evolves
      pokemon.pokemon_data_id = newEvolution.id;
      pokemon.name = newEvolution.name;

      evolvedTo = newEvolution.name;
    }

    pokemon.level = newLevel;
    user.level += 1;

    try {
      await Promise.all([
        pokemon.save(),
        user.save(),
        addPoints(user.username, -LEVEL_UP_COST),
      ]);
      return res.json({
        pokemon: {
          id: pokemon.id,
          name: pokemon.name,
          level: pokemon.level,
          moves: pokemon.moves,
          pokemon_data: evolvedTo ? evolutionPokemonData : pokemon.pokemon_data,
        },
        learnedMove,
        evolvedTo,
        newLevel,
        previousPokemon,
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

    const moveData = await MoveData.findByPk(moveId);
    const newMove = { name: moveData.move_name, learnAt: 1 };
    let learnedMove;
    const userPoints = await getUserPoints(user.username);

    if (userPoints < moveData.price) {
      return res.status(401).json({ message: 'Not enough points' });
    }

    const pokemon = await Pokemon.findByPk(pokemonId, {
      include: 'pokemon_data',
    });

    const alreadyLearned = pokemon.moves.find(
      (move) => move.name === moveData.move_name
    );
    if (alreadyLearned) {
      return res
        .status(401)
        .json({ message: 'Pokemon already learned this move' });
    }

    const canLearn = pokemon.pokemon_data.can_learn.includes(newMove.name);
    if (!canLearn) {
      return res.status(400).json({ message: "Pokemon can't learn this move" });
    }

    if (pokemon.moves.length === 4) {
      const { deleteMove } = req.query;
      if (!deleteMove) {
        return res.status(300).json({
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

  async stoneEvolve(req, res) {
    const { user } = req;
    const { pokemonId, stoneId } = req.params;

    const pokemon = await Pokemon.findByPk(pokemonId, {
      include: 'pokemon_data',
    });

    const stone = await Stone.findByPk(stoneId);
    const points = getUserPoints(user.username);

    if (points < stone.price) {
      return res.status(401).json({ message: 'Not enough points' });
    }

    const [canEvolve, reason] = await canLevelUpOrEvolve(user, pokemon);

    if (!canEvolve) {
      return res
        .status(401)
        .json({ message: `User have one ${reason}`, hasOne: reason });
    }

    const newEvolution = pokemon.pokemon_data.evolutions.find(
      (evolution) => evolution.withItem === stone.name
    );
    const newEvolutionData = await PokemonData.findByPk(newEvolution.id);

    if (!newEvolutionData) {
      return res
        .status(401)
        .json({ message: "Pokemon can't evolve with this item" });
    }

    let learnedMove;
    let evolvedTo;

    if (
      newEvolutionData &&
      !(await hasEvolvedPokemon(newEvolutionData, user))
    ) {
      const evolutionPokemonData = await PokemonData.findOne({
        where: { name: newEvolutionData.name },
      });

      // Pokemon irá aprender novo move ao evoluir
      const newEvolutionMove = willLearnNewMoveEvolved(
        evolutionPokemonData,
        pokemon.level,
        pokemon
      );
      if (newEvolutionMove) {
        if (pokemon.moves.length === 4) {
          const { deleteMove } = req.query;
          if (!deleteMove) {
            return res.status(300).json({
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
            console.log(deleteMove, moveToDelete);
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

      // Gift pokemon to user
      await giftPokemon(user.username, newEvolutionData.name);
      await removePokemon(user.username, pokemon.name);
      triggerAlert({
        type: 'follow',
        message: `${capitalize(user.username)} evoluiu seu ${capitalize(
          pokemon.name
        )} para um ${capitalize(newEvolutionData.name)}`,
        image_href: alertConstants.pokemonEvolveGifUrl,
        sound_href: alertConstants.pokemonEvolvedSoundUrl,
        duration: 3500,
      });

      // Evolves
      pokemon.pokemon_data_id = newEvolutionData.id;
      pokemon.name = newEvolutionData.name;

      evolvedTo = newEvolutionData.name;
    } else {
      return res
        .status(401)
        .json({ message: 'User already has this evolved pokemon' });
    }

    await pokemon.save();

    return res.json({ pokemon, evolvedTo, learnedMove });
  }
}

export default new UserPokemonsController();
