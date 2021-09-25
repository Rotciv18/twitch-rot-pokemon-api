import fillUsersPokemonQueue from '../../../queues/fillUsersPokemonQueue';

const run = async () => {
  fillUsersPokemonQueue.add({}, { repeat: { every: 300000 } });
  console.log('Successfully added to queue!');
};

run();
