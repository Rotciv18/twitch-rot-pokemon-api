import 'dotenv/config';
import fillUsersPokemonQueue from './queues/fillUsersPokemonQueue';
import fillUsers from './jobs/fillUsers';

fillUsersPokemonQueue
  .process(fillUsers)
  .then(() => console.log('Queue Fill Users is now Listening'));
