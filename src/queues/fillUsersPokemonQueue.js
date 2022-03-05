import Queue from 'bull';

export default new Queue('FillPokemonUsersQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});
