const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Job = sequelize.define('Job', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'in-progress', 'completed', 'cancelled'),
      defaultValue: 'open'
    },
    experienceLevel: {
      type: DataTypes.ENUM('entry', 'intermediate', 'expert'),
      allowNull: false
    },
    estimatedHours: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    selectedFreelancerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    contractId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Contracts',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });

  Job.associate = (models) => {
    Job.belongsTo(models.User, { as: 'client', foreignKey: 'clientId' });
    Job.belongsTo(models.User, { as: 'selectedFreelancer', foreignKey: 'selectedFreelancerId' });
    Job.belongsTo(models.Contract, { foreignKey: 'contractId' });
    Job.hasMany(models.Application, { foreignKey: 'jobId' });
  };

  return Job;
}; 