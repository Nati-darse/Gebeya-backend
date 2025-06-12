const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile
} = require('../controllers/authcontroller');
const { protect } = require('../middleware/auth.js');
const {
  validateUserRegistration,
  validateUserLogin
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;