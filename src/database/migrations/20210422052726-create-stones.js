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
      img_url: {
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

    await queryInterface.bulkInsert('stones', [
      {
        name: 'thunder-stone',
        img_url: 'https://www.pngkit.com/png/full/13-131063_stone-png.png',
        price: 5000,
      },
      {
        name: 'water-stone',
        img_url: 'https://www.nicepng.com/png/full/206-2063044_stones-png.png',
        price: 5000,
      },
      {
        name: 'fire-stone',
        img_url:
          'https://www.seekpng.com/png/full/321-3215934_firestone-logo-png.png',
        price: 5000,
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('stones');
  },
};
