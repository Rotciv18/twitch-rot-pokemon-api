import { Router } from 'express';
import UserPokemonsController from '../controllers/Users/UserPokemonsController';

const routes = new Router();

routes.get('/:pokemonId', UserPokemonsController.index);
routes.get('/', UserPokemonsController.list);
routes.post('/:pokemonId/levelup', UserPokemonsController.levelup);
routes.post('/:pokemonId/learn_move', UserPokemonsController.learnMove);
routes.post('/:pokemonId/stones/:stoneId', UserPokemonsController.stoneEvolve);

export default routes;
