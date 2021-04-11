import { Router } from 'express';
import MovesController from '../controllers/Moves/MovesController';

const routes = new Router();

routes.get('/', MovesController.index);

export default routes;
