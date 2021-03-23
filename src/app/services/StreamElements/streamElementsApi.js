import 'dotenv/config';
import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.streamelements.com/kappa/v2',
  headers: {
    Authorization: `Bearer ${process.env.STREAMELEMENTS_BEARER_TOKEN}`,
  },
});
