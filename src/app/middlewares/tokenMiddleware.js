import jwt from 'jsonwebtoken';
import User from '../models/User';
import Position from '../models/Position';
import Setup from '../models/Setup';

export default async (req, res, next) => {
  console.log('eae1');
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const [, token] = auth.split(' ');
  const decoded = jwt.decode(token);

  const user = await User.findByPk(decoded.user_id, {
    include: [
      {
        model: Position,
        as: 'position',
      },
      {
        model: Setup,
        as: 'setup',
        include: ['pokemons'],
      },
    ],
  });
  console.log('eae2');

  if (!user) {
    return res.status(401).json({ message: 'token invalid' });
  }

  req.user = user;

  next();
};
