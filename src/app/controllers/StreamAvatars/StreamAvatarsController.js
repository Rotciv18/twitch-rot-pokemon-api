import User from '../../models/User';
import PokemonData from '../../models/PokemonData';
import Pokemon from '../../models/Pokemon';
import Setup from '../../models/Setup';
import twitchApi from '../../services/twitchApi';
import { addPoints } from '../../services/StreamElements/Points';

class StreamAvatarsController {
  async updateUsers(req, res) {
    const { usersData, usersDictionary } = req.body;

    const promises = Object.entries(usersDictionary).map(
      async ([twitch_id, { ChannelUserName: username }]) => {
        const foundUser = await User.findByPk(twitch_id, {
          include: 'pokemons',
        });
        let userTwitchResponse;
        try {
          userTwitchResponse = await twitchApi.get(`/users?id=${twitch_id}`);
        } catch (e) {
          console.log(twitch_id);
          return;
        }

        if (!userTwitchResponse.data.data[0]) {
          return;
        }
        const { profile_image_url, display_name } =
          userTwitchResponse.data.data[0];

        // FOR BETA TEST ONLY
        if (!foundUser) {
          addPoints(username, 50000);
        }

        const user =
          foundUser ||
          (await User.create({
            id: twitch_id,
            username,
            display_name,
            img_url: profile_image_url,
          }));

        if (!foundUser) {
          const setup = await Setup.create({ user_id: user.id });
          user.update({ setup_id: setup.id, img_url: profile_image_url });
        }
        if (user.username !== username) {
          await user.update({
            username,
            img_url: profile_image_url,
            display_name,
          });
        }
        try {
          const innerPromises = Object.keys(
            usersData[twitch_id].ownedObjects.avatars
          ).map(async (pokemon) => {
            const hasPokemon = user.pokemons
              ? await user.pokemons.find((pkm) => pkm.name === pokemon)
              : null;

            if (!hasPokemon) {
              const pokemonData = await PokemonData.findOne({
                where: { name: pokemon },
              });
              const moves = pokemonData.moves.filter(
                (move) => move.learnAt === 1
              );

              await Pokemon.create({
                user_id: user.id,
                pokemon_data_id: pokemonData.id,
                name: pokemon,
                moves,
                past_learned_moves: moves,
              });
            }
          });
          await Promise.all(innerPromises);
        } catch (e) {
          console.log(`No data found for ${username}`);
        }
      }
    );

    await Promise.all(promises);
    return res.json({ message: 'Users have been updated!' });
  }
}

export default new StreamAvatarsController();
