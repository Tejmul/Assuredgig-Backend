const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Chat = sequelize.define('Chat', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    contractId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Contracts',
        key: 'id'
      }
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true
  });

  Chat.associate = (models) => {
    Chat.belongsTo(models.Contract, { foreignKey: 'contractId' });
    Chat.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId' });
  };

  return Chat;
}; 