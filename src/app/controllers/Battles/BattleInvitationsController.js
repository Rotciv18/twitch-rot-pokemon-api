import BattleInvitation from '../../models/BattleInvitation';

class BattleInvitationsController {
  async index(req, res) {
    const { status } = req.query;
    let battleInvitations;

    if (status) {
      battleInvitations = await BattleInvitation.findAll({
        where: { status },
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
