import twitchClient from '../../../twitchClient';
import channelConfig from '../../../config/channel';

// eslint-disable-next-line import/prefer-default-export
export const giftPokemon = async (username, pokemonName) => {
  await twitchClient.say(
    channelConfig.channelName,
    `!gift ${username} avatar ${pokemonName}`
  );
};
