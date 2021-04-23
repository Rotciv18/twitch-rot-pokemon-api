import { Router } from 'express';
import BattleInvitationsController from '../controllers/Battles/BattleInvitationsController';
import BattleSchedulesController from '../controllers/Battles/BattleSchedulesController';

const routes = new Router();

routes.get('/invitations', BattleInvitationsController.index);
routes.put('/schedules/:schedule_id', BattleSchedulesController.update);
routes.post('/schedules/:schedule_id/result', BattleSchedulesController.result);

export default routes;
