import Setup from '../../models/Setup';
import Pokemon from '../../models/Pokemon';

import { canSetup } from '../../services/UserServices';

class SetupsController {
  async index(req, res) {
    const { user } = req;
    const setup = await Setup.findByPk(user.setup_id, { include: 'pokemons' });

    return res.json({ pokemons: setup.pokemons });
  }

  async store(req, res) {
    const { pokemonId } = req.params;
    const { user } = req;

    const [canUserSetup, reason] = await canSetup(user);
    if (!canUserSetup) {
      return res.status(401).json({ message: `User have one ${reason}` });
    }

    const pokemon = await Pokemon.findByPk(pokemonId);

    if (pokemon.setup_id === user.setup_id) {
      return res.status(400).json({ message: 'Pokemon already in setup' });
    }

    const setup = await Setup.findByPk(user.setup_id, { include: 'pokemons' });
    if (setup.pokemons && setup.pokemons.length === 6) {
      return res.status(400).json({ message: 'Setup already has 6 pokemons' });
    }

    await pokemon.update({ setup_id: setup.id });

    const newSetup = await Setup.findByPk(user.setup_id, {
      include: 'pokemons',
    });
    return res.json(newSetup);
  }

  async delete(req, res) {
    const { pokemonId } = req.params;
    const { user } = req;

    const [canUserSetup, reason] = await canSetup(user);
    if (!canUserSetup) {
      return res.status(401).json({ message: `User have one ${reason}` });
    }

    await Pokemon.update({ setup_id: null }, { where: { id: pokemonId } });

    const setup = await Setup.findByPk(user.setup_id, { include: 'pokemons' });
    return res.json(setup);
  }
}

export default new SetupsController();
