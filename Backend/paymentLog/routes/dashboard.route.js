const router = require('express').Router();
const { getStats } = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/stats', verifyToken, getStats);

module.exports = router;
