import Sequelize, { Model } from 'sequelize';

class Stone extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      { sequelize, tableName: 'stones' }
    );

    return this;
  }
}

export default Stone;
