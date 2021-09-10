import { Router } from 'express';
import UserPositionsController from '../controllers/Users/UserPositionsController';

const routes = new Router();

routes.post('/:position_id', UserPositionsController.store);

export default routes;
