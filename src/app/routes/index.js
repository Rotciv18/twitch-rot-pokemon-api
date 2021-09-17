import { Router } from 'express';
import tokenMiddleware from '../middlewares/tokenMiddleware';

import UsersRoutes from './UsersRoutes';
import UserPokemonsRoutes from './UserPokemonsRoutes';
import MovesRoutes from './MovesRoutes';
import SetupsRoutes from './SetupsRoutes';
import PositionsRoutes from './PositionsRoutes';
import UserBattlesRoutes from './UserBattlesRoutes';
import BattlesRoutes from './BattlesRoutes';
import UserPositionsRoutes from './UserPositionsRoutes';
import PokeballsRoutes from './PokeballsRoutes';
import StonesRoutes from './StonesRoutes';
import StreamAvatarsRoutes from './StreamAvatarsRoutes';

const routes = new Router();

routes.use('/api/stream_avatars', StreamAvatarsRoutes);

routes.use(tokenMiddleware);

routes.use('/api/moves/', MovesRoutes);
routes.use('/api/positions', PositionsRoutes);
routes.use('/api/battles', BattlesRoutes);

routes.use('/api/users', UsersRoutes);
routes.use('/api/users/pokemons', UserPokemonsRoutes);
routes.use('/api/setups', SetupsRoutes);

routes.use('/api/users/battles', UserBattlesRoutes);
routes.use('/api/users/positions', UserPositionsRoutes);

routes.use('/api/pokeballs', PokeballsRoutes);

routes.use('/api/stones', StonesRoutes);

export default routes;
