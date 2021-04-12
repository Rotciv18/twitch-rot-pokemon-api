import BattleSchedule from '../../models/BattleSchedule';

class BattleSchedulesController {
  async update(req, res) {
    const { schedule_id } = req.params;

    const battleSchedule = await BattleSchedule.update(req.body, {
      where: { id: schedule_id },
    });

    return res.json(battleSchedule);
  }
}

export default new BattleSchedulesController();
