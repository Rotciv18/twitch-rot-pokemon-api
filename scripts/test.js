import 'dotenv/config';
import '../src/database';
import User from '../src/app/schemas/User';
import Pokemon from '../src/app/schemas/Pokemon';

async function run() {
  const user = await User.findById('605d99133588ef2d08b2a03b');
  const pokemon = await Pokemon.findOne({ name: 'mizera' }).populate(
    'pokemon_data'
  );
  // await Pokemon.create({
  //   name: 'mizera',
  //   moves: [],
  //   pokemon_data: '605d9758c897643f00d62bdc',
  // });

  console.log(pokemon);
}

run();
