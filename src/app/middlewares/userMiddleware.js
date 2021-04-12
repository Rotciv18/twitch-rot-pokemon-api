import User from '../models/User';

export default async (req, res, next) => {
  const { twitch_id } = req.headers;

  if (!twitch_id) {
    return res.status(400).json({ message: 'ID not provided' });
  }

  const user = await User.findByPk(twitch_id);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  req.user = user;

  next();
};
