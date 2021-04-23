module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('battle_invitations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      challenger_id: {
        type: Sequelize.STRING,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      challenged_id: {
        type: Sequelize.STRING,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      challenger_available_dates: {
        type: Sequelize.ARRAY(Sequelize.DATE),
        allowNull: false,
      },
      position_id: {
        type: Sequelize.INTEGER,
        references: { model: 'positions', key: 'id' },
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('waiting', 'scheduled'),
        defaultValue: 'waiting',
      },
      challenge_type: {
        type: Sequelize.ENUM('casual', 'position'),
        defaultValue: 'casual',
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('battle_invitations');
  },
};
