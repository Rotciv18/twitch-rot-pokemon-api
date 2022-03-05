import axios from 'axios';
import { userData, userDictionary } from '../helpers/StreamAvatarsData';

export default async () => {
  console.log('EXECUTING FILLUSERS NOW:');
  const usersData = await userData();
  const usersDictionary = await userDictionary();

  try {
    const response = await axios.post(
      'http://localhost:3333/api/stream_avatars/users',
      // 'https://pokerot.com/api/stream_avatars/users',
      {
        usersData,
        usersDictionary,
      }
    );

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};
