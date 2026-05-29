const router = require('express').Router();
const { getAllStudents, getStudent, createStudent, updateStudent, deleteStudent, updateAdmissionStatus, submitApplication } = require('../controllers/student.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// Public: submit application
router.post('/apply', submitApplication);

// Protected
router.use(verifyToken);
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post('/', requireRole('admin', 'teacher'), createStudent);
router.put('/:id', requireRole('admin', 'teacher'), updateStudent);
router.patch('/:id/admission-status', requireRole('admin'), updateAdmissionStatus);
router.delete('/:id', requireRole('admin'), deleteStudent);

module.exports = router;
