import Sequelize, { Model } from 'sequelize';

class Move extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        learn_at: Sequelize.INTEGER,
      },
      { sequelize, tableName: 'moves' }
    );

    return this;
  }
}

export default Move;
