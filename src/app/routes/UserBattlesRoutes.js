import { Router } from 'express';
import UserBattleInvitationsController from '../controllers/Users/UserBattleInvitationsController';
import UserBattleSchedulesController from '../controllers/Users/UserBattleSchedulesController';

const routes = new Router();

routes.get('/invitations', UserBattleInvitationsController.index);
routes.post('/invitations', UserBattleInvitationsController.store);
routes.post(
  '/invitations/:invitation_id/schedule',
  UserBattleInvitationsController.schedule
);

routes.get('/schedules', UserBattleSchedulesController.index);

export default routes;
