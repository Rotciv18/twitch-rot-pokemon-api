import { getUserPoints } from '../../services/StreamElements/Points';

class UsersController {
  async index(req, res) {
    const { user } = req;

    const points = await getUserPoints(user.username);

    return res.json({
      ...user.dataValues,
      points,
    });
  }

  async update(req, res) {
    const { user } = req;

    const updatedUser = await user.update(req.body);

    return res.json(updatedUser);
  }
}

export default new UsersController();
