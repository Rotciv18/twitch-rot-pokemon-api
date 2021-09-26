import client from './twitchClient';

import onRawMessageHandler from './app/services/TwitchEvents/onRawMessageHandler';

client.on('raw_message', onRawMessageHandler);

export default client;
