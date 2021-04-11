import { Op } from 'sequelize';
import BattleInvitation from '../../models/BattleInvitation';
import Position from '../../models/Position';

import InvitationValidation from '../../services/BattleServices/InvitationValidation';

class UserBattleInvitationsController {
  async store(req, res) {
    const { user } = req;

    await InvitationValidation.validate(req.body).catch((error) =>
      res.status(401).json(error.errors.join())
    );
    if (user.id === req.body.challenged_id) {
      return res.status(401).json({ message: "Can't challenge yourself" });
    }
    const position = await Position.findByPk(req.body.position_id);
    if (!position) {
      return res.status(400).json({ message: 'Position does not exist' });
    }

    const battleInvitation = await BattleInvitation.create({
      challenger_id: user.id,
      ...req.body,
    });

    return res.json(battleInvitation);
  }

  async index(req, res) {
    const { user } = req;
    const battleInvitations = await BattleInvitation.findAll({
      where: {
        [Op.or]: [{ challenger_id: user.id }, { challenged_id: user.id }],
        is_scheduled: false,
      },
      include: ['challenger', 'challenged'],
    });

    return res.json(battleInvitations);
  }
}

export default new UserBattleInvitationsController();
