const { Sequelize } = require('sequelize');
const config = require('../config/config');

// Initialize Sequelize instance first
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

// Then initialize models
const User = require('./user.model')(sequelize);
const Job = require('./job.model')(sequelize);
const Application = require('./application.model')(sequelize);

// User-Job associations
User.hasMany(Job, { as: 'postedJobs', foreignKey: 'clientId' });
Job.belongsTo(User, { as: 'client', foreignKey: 'clientId' });

// User-Application associations
User.hasMany(Application, { as: 'applications', foreignKey: 'freelancerId' });
Application.belongsTo(User, { as: 'freelancer', foreignKey: 'freelancerId' });

// Job-Application associations
Job.hasMany(Application, { as: 'applications', foreignKey: 'jobId' });
Application.belongsTo(Job, { as: 'job', foreignKey: 'jobId' });

const db = {
  sequelize,
  Sequelize,
  User,
  Job,
  Application
};

module.exports = db; 