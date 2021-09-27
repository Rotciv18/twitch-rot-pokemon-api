import Queue from 'bull';

export default new Queue('AlertPokemonQueue', {
  redis: {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
