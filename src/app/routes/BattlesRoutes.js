import { Router } from 'express';
import BattleInvitationsController from '../controllers/Battles/BattleInvitationsController';
import BattleSchedulesController from '../controllers/Battles/BattleSchedulesController';

const routes = new Router();

routes.get('/invitations', BattleInvitationsController.index);
routes.update('/schedules/:schedule_id', BattleSchedulesController.update);

export default routes;
