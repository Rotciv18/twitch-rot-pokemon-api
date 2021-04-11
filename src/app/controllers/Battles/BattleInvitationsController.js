import BattleInvitation from '../../models/BattleInvitation';

class BattleInvitationsController {
  async index(req, res) {
    const { is_scheduled } = req.query;
    let battleInvitations;

    if (is_scheduled) {
      battleInvitations = await BattleInvitation.findAll({
        where: { is_scheduled },
        include: ['challenger', 'challenged'],
      });
    } else {
      battleInvitations = await BattleInvitation.findAll({
        include: ['challenger', 'challenged'],
      });
    }

    return res.json(battleInvitations);
  }
}

export default new BattleInvitationsController();
