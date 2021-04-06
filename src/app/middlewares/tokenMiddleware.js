import User from '../models/User';

export default async (req, res, next) => {
  const auth = req.headers.authorization;
  const { username } = req.query;

  if (!auth) {
    return res.status(401).json({ message: 'Token not provided' });
  }
  if (!username) {
    return res.status(400).json({ message: 'Username not provided' });
  }

  const [, token] = auth.split(' ');

  if (token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  req.user = user;

  next();
};
