import Sequelize, { Model } from 'sequelize';

class Pokeball extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
      },
      { sequelize, tableName: 'pokeballs' }
    );

    return this;
  }
}

export default Pokeball;
