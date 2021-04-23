import BattleSchedule from '../../models/BattleSchedule';
import Position from '../../models/Position';
import User from '../../models/User';

class BattleSchedulesController {
  async update(req, res) {
    const { schedule_id } = req.params;

    const battleSchedule = await BattleSchedule.update(req.body, {
      where: { id: schedule_id },
    });

    return res.json(battleSchedule);
  }

  async result(req, res) {
    const { winner_id } = req.body;
    const { schedule_id } = req.params;

    const battleSchedule = await BattleSchedule.findByPk(schedule_id);
    await battleSchedule.update({ winner_id });

    if (battleSchedule.challenge_type === 'position') {
      await Position.update(
        { user_id: winner_id },
        { where: { id: battleSchedule.position_id } }
      );
      await User.update(
        { position_id: battleSchedule.position_id },
        { where: { id: winner_id } }
      );
    }

    return res.json(battleSchedule);
  }
}

export default new BattleSchedulesController();
