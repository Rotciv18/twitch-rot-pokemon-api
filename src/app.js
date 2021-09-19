import express from 'express';
import cors from 'cors';
import routes from './app/routes';
import 'dotenv/config';
import './database';

const whitelist = ['http://localhost:8080', 'chrome-extension://'];

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  // credentials: true,
};

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors(corsOptions));
    this.server.use(express.json({ limit: '50mb' }));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
