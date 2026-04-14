const express = require('express');
const { createRoom, getRooms, getRoomById, updateRoom, deleteRoom } = require('../controllers/roomController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', authenticate, authorize(['landlord', 'admin']), createRoom);
router.put('/:id', authenticate, authorize(['landlord', 'admin']), updateRoom);
router.delete('/:id', authenticate, authorize(['landlord', 'admin']), deleteRoom);

module.exports = router;
