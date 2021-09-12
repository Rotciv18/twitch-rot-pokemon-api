import { Router } from 'express';
import StonesController from '../controllers/Stones/StonesController';

const routes = new Router();

routes.get('/', StonesController.index);

export default routes;
