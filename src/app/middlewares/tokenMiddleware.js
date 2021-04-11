import User from '../models/User';

export default async (req, res, next) => {
  const auth = req.headers.authorization;
  const { twitch_id } = req.headers;

  if (!auth) {
    return res.status(401).json({ message: 'Token not provided' });
  }
  if (!twitch_id) {
    return res.status(400).json({ message: 'ID not provided' });
  }

  const [, token] = auth.split(' ');

  if (token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const user = await User.findByPk(twitch_id);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  req.user = user;

  next();
};
