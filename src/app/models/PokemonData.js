import Sequelize, { Model } from 'sequelize';

class PokemonData extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        sprite: Sequelize.STRING,
        moves: Sequelize.JSON,
        evolutions: Sequelize.JSON,
        can_learn: Sequelize.ARRAY(Sequelize.STRING),
      },
      { sequelize, tableName: 'pokemon_datas' }
    );

    return this;
  }
}

export default PokemonData;
