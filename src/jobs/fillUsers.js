import axios from 'axios';
import { userData, twitchViewerId } from '../helpers/StreamAvatarsData';

export default async () => {
  console.log('EXECUTING FILLUSERS NOW:');
  const usersData = await userData();
  const twitchViewersId = await twitchViewerId();

  const response = await axios.post(
    '52.23.163.168:3333/api/stream_avatars/users',
    {
      usersData,
      twitchViewersId,
    }
  );

  console.log(response.data);
};
