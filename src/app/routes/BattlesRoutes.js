import { Router } from 'express';
import BattleInvitationsController from '../controllers/Battles/BattleInvitationsController';

const routes = new Router();

routes.get('/invitations', BattleInvitationsController.index);

export default routes;
