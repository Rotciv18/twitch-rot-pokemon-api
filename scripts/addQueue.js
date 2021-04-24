import checkStreamAvatarsQueue from '../src/queues/checkStreamAvatarsQueue';

checkStreamAvatarsQueue.add(
  {},
  {
    repeat: {
      every: 500,
    },
  }
);
