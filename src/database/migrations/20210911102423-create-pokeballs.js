module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pokeballs', {
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
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    await queryInterface.bulkInsert('pokeballs', [
      { name: 'pokeballs', price: 100 },
      { name: 'greatballs', price: 250 },
      { name: 'ultraballs', price: 600 },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('pokeballs');
  },
};
