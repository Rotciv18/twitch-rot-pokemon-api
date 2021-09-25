import 'dotenv/config';
import twitchApi from './src/app/services/twitchApi';
import fillUsersPokemonQueue from './src/queues/fillUsersPokemonQueue';

const printae = async () => {
  fillUsersPokemonQueue.add();
};

printae();
