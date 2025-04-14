const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { translate } = require('../controllers/translateController');

router.post('/', authenticate, translate);

module.exports = router;