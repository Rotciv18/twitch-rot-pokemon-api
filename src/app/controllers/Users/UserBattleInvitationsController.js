import { Op } from 'sequelize';
import { isSameDay, parseISO } from 'date-fns';
import BattleInvitation from '../../models/BattleInvitation';
import Position from '../../models/Position';
import BattleSchedule from '../../models/BattleSchedule';

import InvitationValidation from '../../services/BattleServices/InvitationValidation';

class UserBattleInvitationsController {
  async store(req, res) {
    const { user } = req;
    const { challenged_id, position_id, challenge_type } = req.body;

    const hasTickets =
      challenge_type === 'casual' ? user.duel_tickets : user.badges;
    if (!hasTickets) {
      return res
        .status(401)
        .json({ message: 'User does not have enough Duel Tickets' });
    }

    let validationError;
    await InvitationValidation.validate(req.body).catch((error) => {
      validationError = error.errors.join();
    });
    if (validationError) {
      return res.status(401).json(validationError);
    }
    if (user.id === challenged_id) {
      return res.status(401).json({ message: "Can't challenge yourself" });
    }

    let position;
    if (challenge_type === 'position') {
      position = await Position.findByPk(position_id);
    }
    if (!position && challenge_type === 'position') {
      return res.status(400).json({ message: 'Position does not exist' });
    }

    const battleInvitation = await BattleInvitation.create({
      challenger_id: user.id,
      ...req.body,
    });
    user.duel_tickets -= 1;
    await user.save();

    return res.json(battleInvitation);
  }

  async index(req, res) {
    const { user } = req;
    const battleInvitations = await BattleInvitation.findAll({
      where: {
        challenged_id: {
          [Op.eq]: user.id,
        },
        status: 'waiting',
      },
      include: ['challenger', 'challenged', 'position'],
    });

    return res.json(battleInvitations);
  }

  async sent(req, res) {
    const { user } = req;

    const sentInvitations = await BattleInvitation.findAll({
      where: {
        challenger_id: {
          [Op.eq]: user.id,
        },
        status: 'waiting',
      },
      include: ['challenger', 'challenged', 'position'],
    });

    return res.json(sentInvitations);
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
    if (battleInvitation.status === 'scheduled') {
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

      await battleInvitation.update({ status: 'scheduled' });

      return res.json(battleSchedule);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
}

export default new UserBattleInvitationsController();
