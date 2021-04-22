class UsersController {
  async index(req, res) {
    const { user } = req;

    return res.json(user);
  }

  async update(req, res) {
    const { user } = req;

    const updatedUser = await user.update(req.body);

    return res.json(updatedUser);
  }
}

export default new UsersController();
