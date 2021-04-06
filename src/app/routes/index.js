import { Router } from 'express';
import tokenMiddleware from '../middlewares/tokenMiddleware';
import UsersRoutes from './UsersRoutes';
import UserPokemonsRoutes from './UserPokemonsRoutes';
import MovesRoutes from './MovesRoutes';
import SetupsRoutes from './SetupsRoutes';

const routes = new Router();

routes.use('/api/moves/', MovesRoutes);

routes.use(tokenMiddleware);

routes.use('/api/users', UsersRoutes);
routes.use('/api/users/pokemons', UserPokemonsRoutes);
routes.use('/api/setups', SetupsRoutes);

export default routes;
