const router = require('express').Router();
const { login, getMe, changePassword, createUser, setupAdmin } = require('../controllers/auth.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.put('/change-password', verifyToken, changePassword);
router.post('/create-user', verifyToken, requireRole('admin'), createUser);
router.post('/setup', setupAdmin);

module.exports = router;
