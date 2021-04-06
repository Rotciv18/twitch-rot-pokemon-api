import { Model } from 'sequelize';

class Setup extends Model {
  static init(sequelize) {
    super.init({}, { sequelize, tableName: 'setups' });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Pokemon, {
      foreignKey: 'setup_id',
      as: 'pokemons',
    });

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default Setup;
