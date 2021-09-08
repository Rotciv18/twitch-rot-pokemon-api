import 'dotenv/config';
import twitchApi from './src/app/services/twitchApi';

const printae = async () => {
  const response = await twitchApi.get('/users?login=rotciv__');

  console.log(response.data);
};

printae();
