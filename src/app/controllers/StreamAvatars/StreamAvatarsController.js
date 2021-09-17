import User from '../../models/User';
import PokemonData from '../../models/PokemonData';
import Pokemon from '../../models/Pokemon';
import Setup from '../../models/Setup';
import twitchApi from '../../services/twitchApi';

class StreamAvatarsController {
  async updateUsers() {
    console.log('EXECUTING FILLUSERS NOW:');
    const { usersData, twitchViewersId } = this.props;

    const promises = Object.entries(twitchViewersId).map(
      async ([twitch_id, username]) => {
        const foundUser = await User.findByPk(twitch_id, {
          include: 'pokemons',
        });
        const userTwitchResponse = await twitchApi.get(
          `/users?login=${username}`
        );
        const { profile_image_url } = userTwitchResponse.data.data[0];

        const user =
          foundUser ||
          (await User.create({
            id: twitch_id,
            username,
            img_url: profile_image_url,
          }));

        if (!foundUser) {
          const setup = await Setup.create({ user_id: user.id });
          user.update({ setup_id: setup.id, img_url: profile_image_url });
        }
        if (user.username !== username) {
          await user.update({ username, img_url: profile_image_url });
        }

        const innerPromises = Object.keys(
          usersData[username].ownedObjects.avatars
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
            });
          }
        });
        await Promise.all(innerPromises);
      }
    );

    await Promise.all(promises);
    console.log('FINISHED FILLING USERS');
  }
}

export default new StreamAvatarsController();
