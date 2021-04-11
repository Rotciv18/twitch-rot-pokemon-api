import { Router } from 'express';
import SetupsController from '../controllers/Setups/SetupsController';

const routes = new Router();

routes.get('/', SetupsController.index);
routes.post('/:pokemonId', SetupsController.store);
routes.delete('/:pokemonId', SetupsController.delete);

export default routes;
