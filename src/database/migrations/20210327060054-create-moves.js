module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('moves', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      learn_at: {
        type: Sequelize.INTEGER,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('moves');
  },
};
