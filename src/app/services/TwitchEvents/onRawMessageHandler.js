import { addDuelTicket } from '../UserServices';

export default async (messageCloned, message) => {
  const rewardId = message.tags['custom-reward-id'];

  if (rewardId === '464c85e3-313f-4634-91e0-27e42769afcf') {
    const userId = message.tags['user-id'];
    await addDuelTicket(userId);
  }
};
