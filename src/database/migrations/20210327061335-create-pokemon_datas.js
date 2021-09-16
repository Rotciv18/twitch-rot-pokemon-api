module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pokemon_datas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sprite: {
        type: Sequelize.STRING,
      },
      evolutions: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      moves: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      },
      can_learn: {
        type: Sequelize.STRING(1000),
        allowNull: true,
        defaultValue: '',
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('pokemon_datas');
  },
};
