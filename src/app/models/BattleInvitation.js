import Sequelize, { Model } from 'sequelize';

class BattleInvitation extends Model {
  static init(sequelize) {
    super.init(
      {
        challenger_available_dates: Sequelize.ARRAY(Sequelize.DATE),
        challenge_type: Sequelize.ENUM('casual', 'position'),
        status: Sequelize.ENUM('waiting', 'scheduled'),
      },
      { sequelize, tableName: 'battle_invitations' }
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

    this.belongsTo(models.Position, {
      foreignKey: 'position_id',
      as: 'position',
    });
  }
}

export default BattleInvitation;
