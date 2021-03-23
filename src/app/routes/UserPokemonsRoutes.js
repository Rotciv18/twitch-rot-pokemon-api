import { Router } from 'express';
import UserPokemonsController from '../controllers/UserPokemonsController';

const routes = new Router();

routes.get('/:pokemonId', UserPokemonsController.index);
routes.get('/', UserPokemonsController.list);
routes.post('/:pokemonId/levelup', UserPokemonsController.levelup);

export default routes;
