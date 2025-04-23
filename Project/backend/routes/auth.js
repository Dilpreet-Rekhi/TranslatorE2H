const express = require('express');
const router = express.Router();
const {
  // verifyEmail,
  registerUser,
  loginUser
} = require('../controllers/authController');

// Register new user
router.post('/register', registerUser);

// Login user and return token
router.post('/login', loginUser);

// Email verification link
// router.get('/verify-email', verifyEmail);

module.exports = router;
