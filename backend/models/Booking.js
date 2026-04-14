const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Room = require('./Room');

const Booking = sequelize.define('Booking', {
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
  },
});

Booking.belongsTo(User, { as: 'tenant', foreignKey: 'tenantId' });
Booking.belongsTo(Room, { as: 'room', foreignKey: 'roomId' });
User.hasMany(Booking, { as: 'bookings', foreignKey: 'tenantId' });
Room.hasMany(Booking, { as: 'bookings', foreignKey: 'roomId' });

module.exports = Booking;
