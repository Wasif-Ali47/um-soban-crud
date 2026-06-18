const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const protect = require('../middleware/auth');

// Create a new user
router.post('/', protect, createUser);

// Get all users (public)
router.get('/', getAllUsers);

// Get a single user by ID
router.get('/:id', protect, getUserById);

// Update a user
router.put('/:id', protect, updateUser);

// Delete a user
router.delete('/:id', protect, deleteUser);

module.exports = router;
