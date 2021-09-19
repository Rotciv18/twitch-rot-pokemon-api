import axios from 'axios';
import https from 'https';
import { userData, twitchViewerId } from '../helpers/StreamAvatarsData';

export default async () => {
  console.log('EXECUTING FILLUSERS NOW:');
  const usersData = await userData();
  const twitchViewersId = await twitchViewerId();

  try {
    const response = await axios.post(
      'https://pokerot.com/api/stream_avatars/users',
      // 'http://localhost:3333/api/stream_avatars/users',
      {
        usersData,
        twitchViewersId,
      },
      {
        // httpsAgent: new https.Agent({
        //   ca: 'C:/Users/vrotc/.ssh/pokerot_privkey.pem',
        // }),
      }
    );

    console.log(response.data);
  } catch (error) {
    console.log(error.error);
  }
};
