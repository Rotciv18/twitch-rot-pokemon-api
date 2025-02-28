module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      display_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      img_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      pokeballs: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      great_balls: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      duel_tickets: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      badges: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ultra_balls: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
