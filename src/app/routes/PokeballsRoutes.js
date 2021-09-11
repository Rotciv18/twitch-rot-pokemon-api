import { Router } from 'express';
import PokeballsController from '../controllers/Pokeballs/PokeballsController';

const routes = new Router();

routes.get('/', PokeballsController.index);
routes.post('/', PokeballsController.store);

export default routes;
