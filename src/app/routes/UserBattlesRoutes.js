import { Router } from 'express';
import UserBattleInvitationsController from '../controllers/Users/UserBattleInvitationsController';

const routes = new Router();

routes.get('/invitations', UserBattleInvitationsController.index);
routes.post('/invitations', UserBattleInvitationsController.store);

export default routes;
