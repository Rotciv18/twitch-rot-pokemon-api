import { Op } from 'sequelize';
import { isSameDay, parseISO } from 'date-fns';
import BattleInvitation from '../../models/BattleInvitation';
import Position from '../../models/Position';
import BattleSchedule from '../../models/BattleSchedule';

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

  async schedule(req, res) {
    const { user } = req;
    const { battle_date } = req.body;
    const { invitation_id } = req.params;
    let isDateUnavailable = true;

    const battleInvitation = await BattleInvitation.findByPk(invitation_id);
    if (!battleInvitation) {
      return res.status(404).json({ message: 'Battle invitation not found' });
    }
    battleInvitation.challenger_available_dates.every((date) => {
      if (isSameDay(date, parseISO(battle_date))) {
        isDateUnavailable = false;
        return false;
      }
      return true;
    });
    if (isDateUnavailable) {
      return res.status(401).json({ message: 'Date is unavailable' });
    }
    if (battleInvitation.challenged_id !== user.id) {
      return res
        .status(401)
        .json({ message: 'Only the challenged user can schedule this battle' });
    }
    if (battleInvitation.is_scheduled) {
      return res.status(401).json({ message: 'Battle was already scheduled' });
    }

    try {
      const battleSchedule = await BattleSchedule.create({
        battle_date: parseISO(battle_date),
        challenge_type: battleInvitation.challenge_type,
        challenger_id: battleInvitation.challenger_id,
        challenged_id: battleInvitation.challenged_id,
        position_id: battleInvitation.position_id,
      });

      await battleInvitation.update({ is_scheduled: true });

      return res.json(battleSchedule);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
}

export default new UserBattleInvitationsController();
