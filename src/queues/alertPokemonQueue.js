import Queue from 'bull';

export default new Queue('AlertPokemonQueue', {
  redis: {
    password: 'WWbezNGfDQuzexjAQ3FFwdMP09jt5Vqm',
    host: 'redis-16736.c256.us-east-1-2.ec2.cloud.redislabs.com',
    port: 16736,
    // password: process.env.REDIS_PASSWORD,
    // host: process.env.REDIS_HOST,
    // port: process.env.REDIS_PORT,
  },
});
