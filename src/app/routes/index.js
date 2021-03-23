import { Router } from 'express';
import tokenMiddleware from '../middlewares/tokenMiddleware';
import UsersRoutes from './UsersRoutes';
import UserPokemonsRoutes from './UserPokemonsRoutes';

const routes = new Router();

routes.use(tokenMiddleware);

routes.get('/', (req, res) => res.json({ message: 'DALE' }));

routes.use('/api/users', UsersRoutes);
routes.use('/api/users/pokemons', UserPokemonsRoutes);

export default routes;
