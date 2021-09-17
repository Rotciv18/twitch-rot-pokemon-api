import express from 'express';
import cors from 'cors';
import routes from './app/routes';
import 'dotenv/config';
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json({ limit: '50mb' }));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
