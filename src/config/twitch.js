import channelConfig from './channel';

export default {
  identity: {
    options: {
      debug: false,
    },
    username: channelConfig.botUsername,
    password: channelConfig.oauthToken,
  },
  channels: [`#${channelConfig.channelName}`],
};
