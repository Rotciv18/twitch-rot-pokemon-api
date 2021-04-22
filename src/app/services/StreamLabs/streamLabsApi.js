import 'dotenv/config';
import axios from 'axios';

export default axios.create({
  baseURL: 'https://streamlabs.com/api/v1.0',
  headers: {
    Authorization: `Bearer ${process.env.STREAMLABS_ACCESS_TOKEN}`,
  },
});
