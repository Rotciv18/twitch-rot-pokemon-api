import { Op } from 'sequelize';
import User from '../../models/User';
import BattleInvitation from '../../models/BattleInvitation';
import BattleSchedule from '../../models/BattleSchedule';
import { getUserPoints } from '../../services/StreamElements/Points';
import Setup from '../../models/Setup';

class UsersController {
  async me(req, res) {
    console.log('oi');
    const { user } = req;

    const points = await getUserPoints(user.username);

    return res.json({
      ...user.dataValues,
      points,
    });
  }

  async list(req, res) {
    const { user } = req;
    const { levelDiff } = req.query;

    let users;

    if (levelDiff) {
      const forbiddenUsers = [];

      const invitations = await BattleInvitation.findAll({
        where: {
          status: 'waiting',
          [Op.or]: [{ challenger_id: user.id }, { challenged_id: user.id }],
        },
      });

      const schedules = await BattleSchedule.findAll({
        where: {
          winner_id: null,
          [Op.or]: [{ challenger_id: user.id }, { challenged_id: user.id }],
        },
      });

      invitations.forEach((invitation) => {
        forbiddenUsers.push(invitation.challenged_id);
        forbiddenUsers.push(invitation.challenger_id);
      });

      schedules.forEach((schedule) => {
        forbiddenUsers.push(schedule.challenged_id);
        forbiddenUsers.push(schedule.challenger_id);
      });

      const maxLevel = parseInt(levelDiff, 10) + user.level;
      const minLevel = Math.max(user.level - parseInt(levelDiff, 10), 5);

      users = await User.findAll({
        include: {
          model: Setup,
          as: 'setup',
          include: ['pokemons'],
        },
        where: {
          id: {
            [Op.notIn]: forbiddenUsers,
            [Op.ne]: user.id,
          },
          '$setup.pokemons.id$': {
            [Op.ne]: null,
          },
          level: {
            [Op.gte]: minLevel,
            [Op.lte]: maxLevel,
          },
        },
      });
    } else {
      users = await User.findAll();
    }

    return res.json(users);
  }

  async update(req, res) {
    const { user } = req;

    const updatedUser = await user.update(req.body);

    return res.json(updatedUser);
  }
}

export default new UsersController();
