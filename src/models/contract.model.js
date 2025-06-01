const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contract = sequelize.define('Contract', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    applicationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Applications',
        key: 'id'
      }
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    paymentSchedule: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'terminated'),
      defaultValue: 'active'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    milestoneAmounts: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    currentMilestone: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    workProgress: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    hoursWorked: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastWorkUpdate: {
      type: DataTypes.DATE
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    freelancerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });

  Contract.associate = (models) => {
    Contract.belongsTo(models.Application, { foreignKey: 'applicationId' });
    Contract.belongsTo(models.User, { as: 'client', foreignKey: 'clientId' });
    Contract.belongsTo(models.User, { as: 'freelancer', foreignKey: 'freelancerId' });
    Contract.hasMany(models.WorkProgress, { foreignKey: 'contractId' });
    Contract.hasMany(models.Meeting, { foreignKey: 'contractId' });
    Contract.hasMany(models.Chat, { foreignKey: 'contractId' });
  };

  return Contract;
}; 