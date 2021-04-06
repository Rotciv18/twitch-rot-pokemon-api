import User from '../app/models/User';
import PokemonData from '../app/models/PokemonData';
import getStreamAvatarsUserData from '../helpers/getStreamAvatarsUserData';
import Pokemon from '../app/models/Pokemon';
import Setup from '../app/models/Setup';

export default async () => {
  console.log('EXECUTING FILLUSERS NOW:');
  const userData = await getStreamAvatarsUserData();

  const promises = Object.keys(userData).map(async (username) => {
    const foundUser = await User.findOne({
      where: { username },
      include: 'pokemons',
    });
    const user = foundUser || (await User.create({ username }));
    if (!foundUser) {
      const setup = await Setup.create({ user_id: user.id });
      user.update({ setup_id: setup.id });
    }

    const innerPromises = Object.keys(
      userData[username].ownedObjects.avatars
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
  });

  await Promise.all(promises);
  console.log('FINISHED FILLING USERS');
};
