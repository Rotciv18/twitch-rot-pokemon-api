import MoveData from '../schemas/MoveData';

class MovesController {
  async index(req, res) {
    const moves = await MoveData.find().sort('name');

    return res.json(moves);
  }
}

export default new MovesController();
