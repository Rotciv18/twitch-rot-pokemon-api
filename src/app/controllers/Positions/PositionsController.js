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
        attributes: ['username'],
        include: {
          model: Setup,
          as: 'setup',
          include: {
            model: Pokemon,
            as: 'pokemons',
            attributes: ['name'],
            include: {
              model: PokemonData,
              as: 'pokemon_data',
              attributes: ['id', 'name', 'sprite'],
            },
          },
        },
      },
    });

    return res.json(positions);
  }
}

export default new PositionsController();
