import express from 'express';
import cors from 'cors';
import routes from './app/routes';
import 'dotenv/config';
import './database';

const whitelist = ['http://localhost:8080', 'chrome-extension://'];

const corsOptions = {
  origin: () => true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json({ limit: '50mb' }));
    this.server.use(cors(corsOptions));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
