const express = require('express');
const router = express.Router();

const { getSettings, updateSettings } = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/authMiddleware'); 

router.get('/', verifyToken, getSettings);
router.post('/', verifyToken, updateSettings);

module.exports = router;