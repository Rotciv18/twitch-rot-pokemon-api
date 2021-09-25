import axios from 'axios';
import { userData, twitchViewerId } from '../helpers/StreamAvatarsData';

export default async () => {
  console.log('EXECUTING FILLUSERS NOW:');
  const usersData = await userData();
  const twitchViewersId = await twitchViewerId();

  try {
    const response = await axios.post(
      'https://pokerot.com/api/stream_avatars/users',
      {
        usersData,
        twitchViewersId,
      }
    );

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};
