import { Router } from 'express';
import UsersController from '../controllers/Users/UsersController';

const routes = new Router();

routes.get('/', UsersController.index);
routes.put('/', UsersController.update);

export default routes;
