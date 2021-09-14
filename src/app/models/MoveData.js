import Sequelize, { Model } from 'sequelize';

class MoveData extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        move_name: Sequelize.STRING,
        price: Sequelize.INTEGER,
      },
      { sequelize, tableName: 'move_datas' }
    );

    return this;
  }
}

export default MoveData;
