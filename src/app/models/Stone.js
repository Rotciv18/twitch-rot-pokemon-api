import Sequelize, { Model } from 'sequelize';

class Stone extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        img_url: Sequelize.STRING,
        price: Sequelize.INTEGER,
      },
      { sequelize, tableName: 'stones' }
    );

    return this;
  }
}

export default Stone;
