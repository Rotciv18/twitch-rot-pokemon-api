import jwt from 'jsonwebtoken';
import User from '../models/User';

export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const [, token] = auth.split(' ');
  const decoded = jwt.decode(token);

  const user = await User.findByPk(decoded.user_id, { include: ['position'] });

  if (!user) {
    return res.status(401).json({ message: 'token invalid' });
  }

  req.user = user;

  next();
};
