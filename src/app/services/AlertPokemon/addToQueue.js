import alertPokemonQueue from '../../../queues/alertPokemonQueue';

async function run() {
  alertPokemonQueue.add();
  console.log('Added to queue!');
}

run();
