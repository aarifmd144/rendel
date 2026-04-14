const Room = require('../models/Room');
const User = require('../models/User');

exports.createRoom = async (req, res) => {
  try {
    const { title, description, price, location, imageUrl } = req.body;
    const room = await Room.create({
      title,
      description,
      price,
      location,
      imageUrl,
      ownerId: req.user.id,
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({ include: [{ model: User, as: 'owner', attributes: ['username'] }] });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, { include: [{ model: User, as: 'owner', attributes: ['username'] }] });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // Landlord can only update their own room, Admin can update any
    if (req.user.role !== 'admin' && room.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, description, price, location, imageUrl } = req.body;
    await room.update({ title, description, price, location, imageUrl });
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    if (req.user.role !== 'admin' && room.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await room.destroy();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
