const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

router.get('/', authMiddleware, recommendationController.getRecommendations);

module.exports = router;