import User from '../app/models/User';
import PokemonData from '../app/models/PokemonData';
import { userData, twitchViewerId } from '../helpers/StreamAvatarsData';
import Pokemon from '../app/models/Pokemon';
import Setup from '../app/models/Setup';

export default async () => {
  console.log('EXECUTING FILLUSERS NOW:');
  const usersData = await userData();
  const twitchViewersId = await twitchViewerId();

  const promises = Object.entries(twitchViewersId).map(
    async ([twitch_id, username]) => {
      const foundUser = await User.findByPk(twitch_id, { include: 'pokemons' });
      const user =
        foundUser || (await User.create({ id: twitch_id, username }));
      if (!foundUser) {
        const setup = await Setup.create({ user_id: user.id });
        user.update({ setup_id: setup.id });
      }
      if (user.username !== username) {
        await user.update({ username });
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
          const moves = pokemonData.moves.filter((move) => move.learnAt === 1);

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
};
