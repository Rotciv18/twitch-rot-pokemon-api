import alertPokemonQueue from '../src/queues/alertPokemonQueue';
// import fillUsersPokemonQueue from '../src/queues/fillUsersPokemonQueue';

async function addToQueues() {
  await alertPokemonQueue.add();
  // await fillUsersPokemonQueue.add({}, { repeat: { every: 300000 } });
  console.log('done');
}

addToQueues();
