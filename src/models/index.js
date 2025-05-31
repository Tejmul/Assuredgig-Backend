const sequelize = require('../config/database');
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

module.exports = {
  sequelize,
  User,
  Job,
  Application
}; 