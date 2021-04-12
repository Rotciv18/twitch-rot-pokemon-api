export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const [, token] = auth.split(' ');

  if (token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  next();
};
