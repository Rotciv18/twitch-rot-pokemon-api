import 'dotenv/config';
import './database';
import alertPokemonQueue from './queues/alertPokemonQueue';
import alertPokemon from './jobs/alertPokemon';
import twitchClient from './twitchClient';
// import checkStreamAvatarsQueue from './queues/checkStreamAvatarsQueue';
// import checkStreamAvatarsUpdate from './jobs/checkStreamAvatarsUpdate';
import fillUsersPokemonQueue from './queues/fillUsersPokemonQueue';
import fillUsers from './jobs/fillUsers';

twitchClient.connect().then(() => console.log('Twitch client now connected'));
fillUsersPokemonQueue.process(fillUsers);
alertPokemonQueue.process(alertPokemon);
// checkStreamAvatarsQueue.process(checkStreamAvatarsUpdate);
