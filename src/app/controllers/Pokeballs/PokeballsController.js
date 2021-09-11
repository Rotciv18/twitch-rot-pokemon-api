import Pokeball from '../../models/Pokeball';
import { getUserPoints, addPoints } from '../../services/StreamElements/Points';

class PokeballsController {
  async store(req, res) {
    const { user } = req;
    const userPoints = await getUserPoints(user.username);
    const { pokeballs, greatballs, ultraballs } = req.body;

    const pokeballsData = await Pokeball.findAll();
    const pokeballsPrice = pokeballsData.find(
      (ball) => ball.name === 'pokeballs'
    ).price;
    const greatballsPrice = pokeballsData.find(
      (ball) => ball.name === 'greatballs'
    ).price;
    const ultraballsPrice = pokeballsData.find(
      (ball) => ball.name === 'ultraballs'
    ).price;

    const totalCost =
      pokeballsPrice * pokeballs +
      greatballsPrice * greatballs +
      ultraballsPrice * ultraballs;

    if (totalCost > userPoints) {
      return res
        .status(401)
        .json({ message: 'User does not have enough points' });
    }

    try {
      await addPoints(user.username, -totalCost);

      user.pokeballs += pokeballs;
      user.great_balls += greatballs;
      user.ultra_balls += ultraballs;
      await user.save();
    } catch (error) {
      return res.status(400).json(error);
    }

    return res.json({ message: 'OK!' });
  }

  async index(req, res) {
    const pokeballs = await Pokeball.findAll();

    return res.json(pokeballs);
  }
}

export default new PokeballsController();
