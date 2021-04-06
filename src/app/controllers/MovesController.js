import MoveData from '../models/MoveData';

class MovesController {
  async index(req, res) {
    const moves = await MoveData.findAll({ order: [['name', 'ASC']] });

    return res.json(moves);
  }
}

export default new MovesController();
