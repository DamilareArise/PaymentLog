const router = require('express').Router();
const { getAllSubjects, createSubject, updateSubject, deleteSubject } = require('../controllers/subject.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', getAllSubjects); // public list
router.use(verifyToken);
router.post('/', requireRole('admin', 'teacher'), createSubject);
router.put('/:id', requireRole('admin', 'teacher'), updateSubject);
router.delete('/:id', requireRole('admin'), deleteSubject);

module.exports = router;
