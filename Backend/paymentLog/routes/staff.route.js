const router = require('express').Router();
const { getAllStaff, getStaffMember, createStaff, updateStaff, deleteStaff, toggleActive } = require('../controllers/staff.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.get('/', getAllStaff);
router.get('/:id', getStaffMember);
router.post('/', requireRole('admin'), createStaff);
router.put('/:id', requireRole('admin'), updateStaff);
router.patch('/:id/toggle-active', requireRole('admin'), toggleActive);
router.delete('/:id', requireRole('admin'), deleteStaff);

module.exports = router;
