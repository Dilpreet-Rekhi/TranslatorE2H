const express = require('express');
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  getProfile
} = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

module.exports = router;