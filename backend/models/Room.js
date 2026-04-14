const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Room = sequelize.define('Room', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  propertyType: {
    type: DataTypes.STRING,
    defaultValue: 'Apartment',
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
});

Room.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Room, { as: 'rooms', foreignKey: 'ownerId' });

module.exports = Room;
