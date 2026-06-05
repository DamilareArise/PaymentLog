const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const c = require('../controllers/cbt.controller');

// ─── Staff routes (admin + teacher) ──────────────────────────────────────────
router.get('/exams', verifyToken, requireRole('admin', 'teacher'), c.listExams);
router.get('/exams/:id', verifyToken, requireRole('admin', 'teacher'), c.getExam);
router.post('/exams', verifyToken, requireRole('admin', 'teacher'), c.createExam);
router.put('/exams/:id', verifyToken, requireRole('admin', 'teacher'), c.updateExam);
router.patch('/exams/:id/publish', verifyToken, requireRole('admin', 'teacher'), c.publishExam);
router.delete('/exams/:id', verifyToken, requireRole('admin', 'teacher'), c.deleteExam);
router.get('/exams/:id/results', verifyToken, requireRole('admin', 'teacher'), c.getExamResults);

// ─── Student routes ───────────────────────────────────────────────────────────
router.get('/student/exams', verifyToken, requireRole('student'), c.studentListExams);
router.get('/student/exams/:id', verifyToken, requireRole('student'), c.studentGetExam);
router.post('/student/exams/:id/submit', verifyToken, requireRole('student'), c.submitExam);
router.get('/student/results', verifyToken, requireRole('student'), c.studentResults);

module.exports = router;
