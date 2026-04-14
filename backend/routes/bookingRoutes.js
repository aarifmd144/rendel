const express = require('express');
const { createBooking, getUserBookings, updateBookingStatus } = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, authorize(['tenant']), createBooking);
router.get('/', authenticate, getUserBookings);
router.put('/:id', authenticate, authorize(['landlord', 'admin']), updateBookingStatus);

module.exports = router;
