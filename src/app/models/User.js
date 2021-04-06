import Sequelize, { Model } from 'sequelize';
import { v4 as uuid } from 'uuid';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        username: Sequelize.STRING,
        level: Sequelize.INTEGER,
      },
      { sequelize, tableName: 'users' }
    );

    this.addHook('beforeCreate', async (user) => {
      user.id = uuid();
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Pokemon, {
      foreignKey: 'user_id',
      as: 'pokemons',
    });
  }
}

export default User;
