import twitchClient from '../../../twitchClient';
import channelConfig from '../../../config/channel';

export const chatMessage = (message) => {
  twitchClient.say(channelConfig.channelName, message);
};

export const giftPokemon = async (username, pokemonName) => {
  chatMessage(`!gift ${username} avatar ${pokemonName}`);
};

export const removePokemon = async (username, pokemonName) => {
  chatMessage(`!remove ${username} avatar ${pokemonName}`);
};

export const emoteOnlyOff = async () => {
  try {
    await twitchClient.emoteonlyoff(channelConfig.channelName);
  } catch (error) {
    console.log(error);
  }
};

export const emoteOnlyOn = async () => {
  try {
    await twitchClient.emoteonly(channelConfig.channelName);
  } catch (error) {
    console.log(error);
  }
};
