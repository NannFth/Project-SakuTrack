const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authMiddleware, authController.register);
router.post('/login', authMiddleware, authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;