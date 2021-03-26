import { Router } from 'express';
import MovesController from '../controllers/MovesController';

const routes = new Router();

routes.get('/', MovesController.index);

export default routes;
