import express from 'express';
import cors from 'cors';
import twitchextensioncsp from 'twitchextensioncsp';
import routes from './app/routes';
import 'dotenv/config';
import './database';

const tls = require('tls');

tls.DEFAULT_MAX_VERSION = 'TLSv1.3';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json({ limit: '50mb' }));
    this.server.use(
      twitchextensioncsp({
        clientID: process.env.TWITCH_CLIENT_ID,
      })
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
