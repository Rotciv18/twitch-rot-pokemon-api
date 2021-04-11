import { Router } from 'express';
import UserBattleInvitationsController from '../controllers/Users/UserBattleInvitationsController';

const routes = new Router();

routes.get('/invitations', UserBattleInvitationsController.store);

export default routes;
