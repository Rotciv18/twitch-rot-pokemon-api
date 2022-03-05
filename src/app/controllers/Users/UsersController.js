import { Op } from 'sequelize';
import User from '../../models/User';
import { getUserPoints } from '../../services/StreamElements/Points';
import Setup from '../../models/Setup';
import sumArrayProperties from '../../../helpers/sumArrayProperties';

class UsersController {
  async me(req, res) {
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
      const permittedUsers = [];
      const userSetupLevel = sumArrayProperties(user.setup.pokemons, 'level');
      if (!userSetupLevel) {
        return res.json([]);
      }

      const maxLevel = parseInt(levelDiff, 10) + userSetupLevel;
      const minLevel = Math.max(userSetupLevel - parseInt(levelDiff, 10), 10);

      const setups = await Setup.findAll({
        include: ['pokemons'],
        where: {
          user_id: {
            [Op.ne]: user.id,
          },
          '$pokemons.level$': {
            [Op.gte]: minLevel,
            [Op.lte]: maxLevel,
          },
        },
      });
      setups.forEach((setup) => permittedUsers.push(setup.user_id));

      users = await User.findAll({
        include: {
          model: Setup,
          as: 'setup',
          include: ['pokemons'],
        },
        where: {
          id: {
            [Op.in]: permittedUsers,
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
