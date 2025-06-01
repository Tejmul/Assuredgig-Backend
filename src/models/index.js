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
const Portfolio = require('./portfolio.model')(sequelize);
const Contract = require('./contract.model')(sequelize);
const Meeting = require('./meeting.model')(sequelize);
const WorkProgress = require('./workProgress.model')(sequelize);
const Notification = require('./notification.model')(sequelize);
const NotificationPreference = require('./notificationPreference.model')(sequelize);

// User-Job associations
User.hasMany(Job, { as: 'postedJobs', foreignKey: 'clientId' });
Job.belongsTo(User, { as: 'client', foreignKey: 'clientId' });

// User-Application associations
User.hasMany(Application, { as: 'applications', foreignKey: 'freelancerId' });
Application.belongsTo(User, { as: 'freelancer', foreignKey: 'freelancerId' });

// Job-Application associations
Job.hasMany(Application, { as: 'applications', foreignKey: 'jobId' });
Application.belongsTo(Job, { as: 'job', foreignKey: 'jobId' });

// User-Portfolio associations
User.hasMany(Portfolio, { as: 'portfolio', foreignKey: 'freelancerId' });
Portfolio.belongsTo(User, { as: 'freelancer', foreignKey: 'freelancerId' });

// Contract associations
Contract.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Contract.belongsTo(User, { as: 'freelancer', foreignKey: 'freelancerId' });
Contract.belongsTo(Job, { foreignKey: 'jobId' });
Contract.hasMany(WorkProgress, { 
  foreignKey: 'contractId',
  as: 'progressUpdates'
});
Contract.hasMany(Meeting, { 
  foreignKey: 'contractId',
  as: 'meetings'
});

// Meeting associations
Meeting.belongsTo(User, { as: 'organizer', foreignKey: 'organizerId' });
Meeting.belongsTo(User, { as: 'participant', foreignKey: 'participantId' });
Meeting.belongsTo(Contract, { as: 'contract', foreignKey: 'contractId' });

// WorkProgress associations
WorkProgress.belongsTo(Contract, { as: 'contract', foreignKey: 'contractId' });
WorkProgress.belongsTo(User, { as: 'freelancer', foreignKey: 'freelancerId' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });

// NotificationPreference associations
NotificationPreference.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(NotificationPreference, { foreignKey: 'userId' });

const db = {
  sequelize,
  Sequelize,
  User,
  Job,
  Application,
  Portfolio,
  Contract,
  Meeting,
  WorkProgress,
  Notification,
  NotificationPreference
};

module.exports = db; 