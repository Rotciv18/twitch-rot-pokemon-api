import PokemonData from '../app/models/PokemonData';
import Pokemon from '../app/models/Pokemon';
import User from '../app/models/User';

import { triggerAlert } from '../app/services/StreamLabs/Alerts';
import twitchClient from '../twitchClient';
import channelConfig from '../config/channel';
import alertConstants from '../config/alertConstants';
import { giftPokemon } from '../app/services/Twitch/twitchServices';

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function isBall(pokeballString) {
  return pokeballString === '!ball' || '!great' || '!ultra';
}

function ballChance(ballType) {
  switch (ballType) {
    case '!ball':
      return 25;

    case '!great':
      return 50;

    case '!ultra':
      return 75;

    default:
      return null;
  }
}

function hasPokeballs(user, ballType) {
  switch (ballType) {
    case '!ball':
      return user.pokeballs > 0;

    case '!great':
      return user.great_balls > 0;

    case '!ultra':
      return user.ultra_balls > 0;

    default:
      return null;
  }
}

export default async () => {
  const commonPokemonIds = [
    1,
    4,
    7,
    10,
    13,
    16,
    21,
    23,
    25,
    27,
    29,
    32,
    35,
    37,
    39,
    41,
    43,
    46,
    48,
    50,
    52,
    54,
    56,
    58,
    60,
    63,
    66,
    69,
    72,
    74,
    77,
    79,
    81,
    83,
    84,
    86,
    88,
    90,
    92,
    95,
    96,
    98,
    100,
    104,
    106,
    107,
    108,
    109,
    113,
    114,
    116,
    118,
    120,
    122,
    129,
    132,
  ];
  const rarePokemonIds = [
    102,
    111,
    115,
    123,
    124,
    125,
    126,
    127,
    128,
    131,
    133,
    137,
    138,
    140,
    142,
    143,
    147,
  ];
  let chosenId;
  const rand = Math.floor(Math.random() * 10);
  if (rand === 9) {
    chosenId =
      rarePokemonIds[Math.floor(Math.random() * rarePokemonIds.length)];
  } else {
    chosenId =
      commonPokemonIds[Math.floor(Math.random() * commonPokemonIds.length)];
  }

  const pokemonData = await PokemonData.findByPk(chosenId);
  const { success } = await triggerAlert({
    type: 'follow',
    image_href: pokemonData.sprite,
    message: 'Um pokemon selvagem apareceu!',
    duration: 4000,
    sound_href: `https://pokemoncries.com/cries-old/${pokemonData.id}.mp3`,
  });

  if (success) {
    let isInCatch = false;
    let disconnected = false;

    twitchClient.on('message', async (channel, userstate, message, self) => {
      if (self) {
        return;
      }

      const { username } = userstate;
      const userDisplayName = userstate['display-name'];
      message = message.toLocaleLowerCase();
      const [ballType, pokemonMessage] = message.split(' ');
      const user = await User.findOne({
        where: { username },
        include: 'pokemons',
      });

      // User typed correctly
      if (
        pokemonMessage === `${pokemonData.name}` &&
        !isInCatch &&
        isBall(ballType)
      ) {
        twitchClient.emoteonly(channelConfig.channelName);
        isInCatch = true;
        const roll = Math.floor(Math.random() * 100) + 1;
        const hasPokemon = user.pokemons.find(
          (pokemon) => pokemon.name === pokemonData.name
        );

        // User has pokeballs
        if (!hasPokeballs(user, ballType)) {
          isInCatch = false;
          twitchClient.emoteonlyoff(channelConfig.channelName);
          twitchClient.say(
            channelConfig.channelName,
            `${userDisplayName} não tem pokebolas!`
          );

          // User has Pokemons
        } else if (hasPokemon) {
          isInCatch = false;
          twitchClient.emoteonlyoff(channelConfig.channelName);
          twitchClient.say(
            channelConfig.channelName,
            `${userDisplayName} já tem um ${capitalize(pokemonData.name)}!`
          );

          // User catched the pokemon
        } else if (roll <= ballChance(ballType)) {
          disconnected = true;
          setTimeout(() => {
            twitchClient.say(channelConfig.channelName, '1...');
            setTimeout(() => {
              twitchClient.say(channelConfig.channelName, '2...');
              setTimeout(() => {
                twitchClient.say(channelConfig.channelName, '3...');
                setTimeout(async () => {
                  // Catching Pokemon

                  twitchClient.say(
                    channelConfig.channelName,
                    `${capitalize(pokemonData.name)} foi capturado!`
                  );

                  triggerAlert({
                    type: 'follow',
                    image_href: alertConstants.pokemonCatchGifUrl,
                    message: `${userDisplayName} capturou um ${capitalize(
                      pokemonData.name
                    )}`,
                    duration: 5000,
                    sound_href: alertConstants.pokemonCatchSoundUrl,
                  });

                  const moves = pokemonData.moves.filter(
                    (move) => move.learnAt === 1
                  );
                  await Pokemon.create({
                    moves,
                    user_id: user.id,
                    pokemon_data_id: pokemonData.id,
                    name: pokemonData.name,
                  });

                  await giftPokemon(username, pokemonData.name);
                  await twitchClient.emoteonlyoff(channelConfig.channelName);

                  twitchClient.disconnect();
                }, 500);
              }, 1000);
            }, 1000);
          }, 150);

          // User missed the pokemon
        } else {
          setTimeout(() => {
            twitchClient.say(channelConfig.channelName, '1...');
            setTimeout(() => {
              twitchClient.say(channelConfig.channelName, '2...');
              setTimeout(async () => {
                // Failing to catch pokemon

                twitchClient.say(
                  channelConfig.channelName,
                  `${capitalize(
                    pokemonData.name
                  )} escapou da pokebola de ${userDisplayName}`
                );

                await twitchClient.emoteonlyoff(channelConfig.channelName);
                isInCatch = false;
              }, 1000);
            }, 1000);
          }, 150);
        }
      }
    });

    twitchClient.connect();

    setTimeout(() => {
      twitchClient.emoteonlyoff(channelConfig.channelName);
      if (!disconnected) {
        twitchClient.say(
          channelConfig.channelName,
          `O ${capitalize(pokemonData.name)} fugiu!`
        );
        twitchClient.disconnect();
      }
    }, 45000);
  }
};
