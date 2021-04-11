import BattleInvitation from '../../models/BattleInvitation';
import InvitationValidation from '../../services/BattleServices/InvitationValidation';

class UserBattleInvitationsController {
  async store(req, res) {
    const { user } = req;

    await InvitationValidation.validate(req.body).catch((error) =>
      res.status(401).json(error.errors.join())
    );

    const battleInvitation = await BattleInvitation.create({
      challenger_id: user.id,
      ...req.body,
    });

    return res.json(battleInvitation);
  }
}

export default new UserBattleInvitationsController();
