class UsersController {
  async index(req, res) {
    const { user } = req;

    return res.json(user);
  }
}

export default new UsersController();
