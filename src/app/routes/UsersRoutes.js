import { Router } from 'express';
import UsersController from '../controllers/Users/UsersController';

const routes = new Router();

routes.get('/me', UsersController.me);
routes.get('/list', UsersController.list);
routes.put('/', UsersController.update);

export default routes;
