import '../src/database';
import { triggerAlert } from '../src/app/services/StreamLabs/Alerts';
import alertPokemon from '../src/jobs/alertPokemon';
import twitchClient from '../src/twitchClient';

async function triggerNow() {
  // const status = await triggerAlert({
  //   image_href:
  //     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png',
  //   type: 'follow',
  // });

  // console.log(status);

  alertPokemon();
}

setTimeout(() => {
  twitchClient.connect();
  triggerNow();
}, 500);
