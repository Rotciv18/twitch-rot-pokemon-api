import User from '../app/schemas/User';
import PokemonData from '../app/schemas/PokemonData';
import getStreamAvatarsUserData from '../helpers/getStreamAvatarsUserData';

export default async () => {
  console.log('EXECUTING FILLUSERS NOW:');
  const userData = await getStreamAvatarsUserData();

  const promises = Object.keys(userData).map(async (username) => {
    const foundUser = await User.findOne({ username });
    const user = foundUser || (await User.create({ username }));

    const innerPromises = Object.keys(
      userData[username].ownedObjects.avatars
    ).map(async (pokemon) => {
      const hasPokemon = await user.pokemons.find(
        (pkm) => pkm.name === pokemon
      );

      if (!hasPokemon) {
        const pokemonData = await PokemonData.findOne({ name: pokemon });
        const moves = pokemonData.moves.filter((move) => move.learnAt === 1);

        user.pokemons.push({
          pokemon_data: pokemonData,
          name: pokemon,
          moves,
        });
      }
      // console.log(user.pokemons);
    });
    await Promise.all(innerPromises);
    user.save();
  });

  Promise.all(promises);
  console.log('FINISHED FILLING USERS');
};
