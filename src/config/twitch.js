import channelConfig from './channel';

export default {
  identity: {
    options: {
      debug: true,
    },
    username: channelConfig.botUsername,
    password: channelConfig.oauthToken,
  },
  channels: [`#${channelConfig.channelName}`],
};
