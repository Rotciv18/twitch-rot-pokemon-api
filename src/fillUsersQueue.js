import 'dotenv/config';
import fillUsersPokemonQueue from './queues/fillUsersPokemonQueue';
import fillUsers from './jobs/fillUsers';

fillUsersPokemonQueue
  .process(fillUsers)
  .catch((e) => console.log(e))
  .then(() => console.log('Queue Fill Users is now Listening'));
