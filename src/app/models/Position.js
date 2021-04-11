import Sequelize, { Model } from 'sequelize';

class Position extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        position_type: Sequelize.ENUM('gym', 'elite', 'champion'),
      },
      { sequelize, tableName: 'positions' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default Position;
