import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import MoveData from '../app/models/MoveData';
import PokemonData from '../app/models/PokemonData';
import Pokemon from '../app/models/Pokemon';
import User from '../app/models/User';
import Setup from '../app/models/Setup';
import Position from '../app/models/Position';
import BattleInvitation from '../app/models/BattleInvitation';
import BattleSchedule from '../app/models/BattleSchedule';
import Stone from '../app/models/Stone';
import Pokeball from '../app/models/Pokeball';

const models = [
  MoveData,
  PokemonData,
  Pokemon,
  User,
  Setup,
  BattleInvitation,
  BattleSchedule,
  Position,
  Stone,
  Pokeball,
];

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
