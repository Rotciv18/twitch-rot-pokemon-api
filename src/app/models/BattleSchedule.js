import Sequelize, { Model } from 'sequelize';

class BattleSchedule extends Model {
  static init(sequelize) {
    super.init(
      {
        battle_date: Sequelize.DATE,
        challenge_type: Sequelize.ENUM('casual', 'position'),
      },
      { sequelize, tableName: 'battle_schedules' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'challenger_id',
      as: 'challenger',
    });

    this.belongsTo(models.User, {
      foreignKey: 'challenged_id',
      as: 'challenged',
    });

    this.belongsTo(models.User, {
      foreignKey: 'winner_id',
      as: 'winner',
    });

    this.belongsTo(models.Position, {
      foreignKey: 'position_id',
      as: 'position',
    });
  }
}

export default BattleSchedule;
