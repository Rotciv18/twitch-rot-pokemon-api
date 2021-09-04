import { Router } from 'express';
import tokenMiddleware from '../middlewares/tokenMiddleware';

import UsersRoutes from './UsersRoutes';
import UserPokemonsRoutes from './UserPokemonsRoutes';
import MovesRoutes from './MovesRoutes';
import SetupsRoutes from './SetupsRoutes';
import PositionsRoutes from './PositionsRoutes';
import UserBattlesRoutes from './UserBattlesRoutes';
import BattlesRoutes from './BattlesRoutes';

const routes = new Router();

routes.use(tokenMiddleware);

routes.use('/api/moves/', MovesRoutes);
routes.use('/api/positions', PositionsRoutes);
routes.use('/api/battles', BattlesRoutes);

routes.use('/api/users', UsersRoutes);
routes.use('/api/users/pokemons', UserPokemonsRoutes);
routes.use('/api/setups', SetupsRoutes);

routes.use('/api/users/battles', UserBattlesRoutes);

export default routes;
