import Sequelize, { Model } from 'sequelize';
import { v4 as uuid } from 'uuid';

class Pokemon extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        level: Sequelize.INTEGER,
        moves: Sequelize.JSON,
        past_learned_moves: Sequelize.JSON,
      },
      { sequelize, tableName: 'pokemons' }
    );

    this.addHook('beforeCreate', async (pokemon) => {
      pokemon.id = uuid();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.PokemonData, {
      foreignKey: 'pokemon_data_id',
      as: 'pokemon_data',
    });

    this.belongsTo(models.Setup, {
      foreignKey: 'setup_id',
      as: 'setup',
    });
  }
}

export default Pokemon;
