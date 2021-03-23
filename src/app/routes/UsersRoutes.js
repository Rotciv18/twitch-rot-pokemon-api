import { Router } from 'express';
import UsersController from '../controllers/UsersController';

const routes = new Router();

routes.get('/', UsersController.index);

export default routes;
