const express = require('express');
const { getUsers, deleteUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authenticate, authorize(['admin']), getUsers);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router;
