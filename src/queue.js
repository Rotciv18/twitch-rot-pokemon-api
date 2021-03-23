import 'dotenv/config';
import './database';
import fillUsersPokemonQueue from './queues/fillUsersPokemonQueue';
import fillUsers from './jobs/fillUsers';

fillUsersPokemonQueue.process(fillUsers);
