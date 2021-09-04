import alertPokemonQueue from '../src/queues/alertPokemonQueue';
import fillUsersPokemonQueue from '../src/queues/fillUsersPokemonQueue';

alertPokemonQueue.add();
fillUsersPokemonQueue.add({}, { repeat: { every: 300000 } });
console.log('done');
