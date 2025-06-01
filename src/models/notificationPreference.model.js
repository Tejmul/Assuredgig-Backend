const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NotificationPreference = sequelize.define('NotificationPreference', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    jobMatches: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    applicationUpdates: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    contractUpdates: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    meetingReminders: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    workProgressUpdates: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    messages: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    pushNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    inAppNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  NotificationPreference.associate = (models) => {
    NotificationPreference.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return NotificationPreference;
}; 