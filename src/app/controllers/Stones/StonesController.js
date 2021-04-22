import Stone from '../../models/Stone';

class StonesController {
  async index(req, res) {
    const stones = await Stone.findAll();

    return res.json(stones);
  }
}

export default new StonesController();
