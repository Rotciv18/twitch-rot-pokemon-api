module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stones', {
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
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    await queryInterface.bulkInsert('stones', [
      { name: 'thunder-stone' },
      { name: 'water-stone' },
      { name: 'fire-stone' },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('stones');
  },
};
