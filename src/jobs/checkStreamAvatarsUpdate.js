import axios from 'axios';
import Pokemon from '../app/models/Pokemon';
import PokemonData from '../app/models/PokemonData';

export default async () => {
  const response = await axios.get(
    'https://server.streamavatars.com/ext/updates/33699502'
  );

  if (response.data.commands.length > 0) {
    const promises = response.data.commands.map(async (command) => {
      if (command.action === 'PurchaseAvatar') {
        const pokemonAlreadyOwned = await Pokemon.findOne({
          where: { name: command.avatar, user_id: command.userId },
        });

        if (!pokemonAlreadyOwned) {
          const pokemonData = await PokemonData.findOne({
            where: { name: command.avatar },
          });
          const moves = pokemonData.moves.filter((move) => move.learnAt === 1);
          await Pokemon.create({
            moves,
            user_id: command.userId,
            pokemon_data_id: pokemonData.id,
            name: pokemonData.name,
          });
        }
      }
    });

    await Promise.all(promises);
    console.log('finished');
  }
};
