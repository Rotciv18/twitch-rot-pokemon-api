import twitchClient from '../../../twitchClient';
import channelConfig from '../../../config/channel';

export const giftPokemon = async (username, pokemonName) => {
  await twitchClient.say(
    channelConfig.channelName,
    `!gift ${username} avatar ${pokemonName}`
  );
};

export const chatMessage = (message) => {
  twitchClient.say(channelConfig.channelName, message);
};
