const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.body;
    const room = await Room.findByPk(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const booking = await Booking.create({
      roomId,
      startDate,
      endDate,
      tenantId: req.user.id,
      status: 'pending',
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'tenant') {
      bookings = await Booking.findAll({
        where: { tenantId: req.user.id },
        include: [{ model: Room, as: 'room' }],
      });
    } else if (req.user.role === 'landlord') {
      bookings = await Booking.findAll({
        include: [
          {
            model: Room,
            as: 'room',
            where: { ownerId: req.user.id },
          },
          { model: User, as: 'tenant', attributes: ['username'] },
        ],
      });
    } else if (req.user.role === 'admin') {
      bookings = await Booking.findAll({
        include: [{ model: Room, as: 'room' }, { model: User, as: 'tenant', attributes: ['username'] }],
      });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id, { include: [{ model: Room, as: 'room' }] });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Only landlord of the room or admin can update status
    if (req.user.role !== 'admin' && booking.room.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await booking.update({ status });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
