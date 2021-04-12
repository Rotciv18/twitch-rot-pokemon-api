import { Op } from 'sequelize';
import BattleSchedule from '../../models/BattleSchedule';

class UserBattleSchedulesController {
  async index(req, res) {
    const { user } = req;

    const battleSchedules = await BattleSchedule.findAll({
      where: {
        [Op.or]: [{ challenger_id: user.id }, { challenged_id: user.id }],
        winner_id: null,
      },
      include: ['challenger', 'challenged'],
    });

    return res.json(battleSchedules);
  }
}

export default new UserBattleSchedulesController();
