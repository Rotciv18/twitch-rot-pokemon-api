import Position from '../../models/Position';

class UserPositionsController {
  async store(req, res) {
    const { user } = req;
    const { position_id } = req.params;

    const position = await Position.findByPk(position_id);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    if (user.position_id) {
      await Position.update(
        { user_id: null },
        { where: { id: user.position_id } }
      );
    }

    user.position_id = position_id;
    user.badges -= 1;
    position.user_id = user.id;

    await position.save();
    await user.save();

    return res.json(user.position_id);
  }
}

export default new UserPositionsController();
