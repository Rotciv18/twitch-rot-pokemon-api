import '../src/database';
import PokemonData from '../src/app/models/PokemonData';

async function triggerNow() {
  const pokemon = await PokemonData.findOne({ where: { name: 'pidgeotto' } });

  console.log(pokemon.name);
}

setTimeout(() => {
  triggerNow();
}, 500);
