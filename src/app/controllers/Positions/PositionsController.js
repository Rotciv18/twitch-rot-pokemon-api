import Position from '../../models/Position';
import User from '../../models/User';
import Setup from '../../models/Setup';
import Pokemon from '../../models/Pokemon';
import PokemonData from '../../models/PokemonData';

class PositionsController {
  async index(req, res) {
    const positions = await Position.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'img_url', 'id', 'display_name'],
        include: {
          model: Setup,
          as: 'setup',
          include: {
            model: Pokemon,
            as: 'pokemons',
            attributes: ['name', 'id'],
            include: {
              model: PokemonData,
              as: 'pokemon_data',
              attributes: ['id', 'name', 'sprite'],
            },
          },
        },
      },
      order: [['id', 'ASC']],
    });

    return res.json(positions);
  }
}

export default new PositionsController();
