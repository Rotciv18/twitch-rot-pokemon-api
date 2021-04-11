import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
        username: Sequelize.STRING,
        level: Sequelize.INTEGER,
      },
      { sequelize, tableName: 'users' }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Pokemon, {
      foreignKey: 'user_id',
      as: 'pokemons',
    });

    this.belongsTo(models.Setup, {
      foreignKey: 'setup_id',
      as: 'setup',
    });
  }
}

export default User;
