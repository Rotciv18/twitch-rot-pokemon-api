import fillUsersQueue from './src/queues/fillUsersPokemonQueue';

fillUsersQueue.add(
  {},
  {
    repeat: {
      every: 300000,
    },
  }
);
