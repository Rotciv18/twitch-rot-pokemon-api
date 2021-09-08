import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
    'Client-Id': process.env.TWITCH_CLIENT_ID,
  },
});

export default api;
