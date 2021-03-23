import User from '../schemas/User';

export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(400).json({ message: 'Token not provided' });
  }

  const [, token] = auth.split(' ');

  if (token !== process.env.AUTH_TOKEN) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  const { username } = req.query;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  req.user = user;

  next();
};
