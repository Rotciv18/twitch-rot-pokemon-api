import { Router } from 'express';
import StreamAvatarsController from '../controllers/StreamAvatars/StreamAvatarsController';

const routes = new Router();

routes.post('/users', StreamAvatarsController.updateUsers);

export default routes;
