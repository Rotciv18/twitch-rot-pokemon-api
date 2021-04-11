import { Router } from 'express';
import PositionsController from '../controllers/Positions/PositionsController';

const routes = new Router();

routes.get('/', PositionsController.index);

export default routes;
