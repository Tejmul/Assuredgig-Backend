require('dotenv').config();
const { sequelize } = require('../models');

async function initDatabase() {
  try {
    console.log('Initializing database...');
    await sequelize.sync({ force: true });
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase(); 