import tmi from 'tmi.js';
import 'dotenv/config';
import './database';

import twitchBotConfig from './config/twitch';

export default new tmi.Client(twitchBotConfig);
