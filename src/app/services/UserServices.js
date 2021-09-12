import { Op } from 'sequelize';
import BattleInvitation from '../models/BattleInvitation';
import BattleSchedule from '../models/BattleSchedule';

export const hasPokeballs = (user, ballType) => {
  switch (ballType) {
    case '!ball':
      return user.pokeballs > 0;

    case '!great':
      return user.great_balls > 0;

    case '!ultra':
      return user.ultra_balls > 0;

    default:
      return null;
  }
};

export const removeBall = (user, ballType) => {
  switch (ballType) {
    case '!ball':
      return user.update({ pokeballs: user.pokeballs - 1 });

    case '!great':
      return user.update({ great_balls: user.great_balls - 1 });

    case '!ultra':
      return user.update({ ultra_balls: user.ultra_balls - 1 });

    default:
      return null;
  }
};

export const canSetup = async (user) => {
  // Has a position?
  if (user.position_id) {
    return [false, 'position'];
  }
  // Has a battle invitation?
  const battleInvitation = await BattleInvitation.findOne({
    where: {
      status: 'waiting',
      [Op.or]: [{ challenger_id: user.id }, { challenged_id: user.id }],
    },
  });
  if (battleInvitation) {
    return [false, 'battle_invitation'];
  }
  // Has a battle scheduled?
  const battleSchedule = await BattleSchedule.findOne({
    where: {
      [Op.or]: [{ challenger_id: user.id }, { challenged_id: user.id }],
      battle_date: { [Op.gte]: Date.now() },
    },
  });
  if (battleSchedule) {
    return [false, 'battle_schedule'];
  }

  return [true, null];
};

export const canLevelUpOrEvolve = async (user, pokemon) => {
  if (!user.setup.pokemons.length) {
    return true;
  }

  // Is pokemon in setup?
  const pokemonInSetup = user.setup.pokemons.find(
    (pkm) => pkm.name === pokemon.name
  );

  // Has a position?
  if (user.position_id && pokemonInSetup) {
    return [false, 'position'];
  }

  if (pokemonInSetup) {
    // Has a battle invitation?
    const battleInvitation = await BattleInvitation.findOne({
      where: {
        status: 'waiting',
        [Op.or]: [{ challenger_id: user.id }, { challenged_id: user.id }],
      },
    });
    if (battleInvitation) {
      return [false, 'battle_invitation'];
    }

    // Has a battle scheduled?
    const battleSchedule = await BattleSchedule.findOne({
      where: {
        [Op.or]: [{ challenger_id: user.id }, { challenged_id: user.id }],
        battle_date: { [Op.gte]: Date.now() },
      },
    });
    if (battleSchedule) {
      return [false, 'battle_schedule'];
    }
  }

  return [true, null];
};
