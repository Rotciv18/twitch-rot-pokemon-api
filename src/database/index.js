import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import MoveData from '../app/models/MoveData';
import PokemonData from '../app/models/PokemonData';
import Pokemon from '../app/models/Pokemon';
import User from '../app/models/User';

const models = [MoveData, PokemonData, Pokemon, User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
