import 'dotenv/config';
import './database';
import alertPokemonQueue from './queues/alertPokemonQueue';
import alertPokemon from './jobs/alertPokemon';
import twitchClient from './twitchClient';

twitchClient.connect().then(() => console.log('Twitch client now connected'));
alertPokemonQueue.process(alertPokemon);
