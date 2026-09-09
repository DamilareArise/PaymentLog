const Exam = require('../models/exam.model');
const Result = require('../models/result.model');
const Student = require('../models/student.model');

// ─── Staff ────────────────────────────────────────────────────────────────────

const listExams = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const total = await Exam.countDocuments();
    const exams = await Exam.find()
      .sort({ createdAt: -1 })
      .select('-questions')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ status: 'success', data: exams, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ status: 'error', message: 'Exam not found.' });
    res.json({ status: 'success', data: exam });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const createExam = async (req, res) => {
  try {
    const exam = new Exam({ ...req.body, createdBy: req.user.referenceId });
    await exam.save();
    res.status(201).json({ status: 'success', data: exam });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) return res.status(404).json({ status: 'error', message: 'Exam not found.' });
    res.json({ status: 'success', data: exam });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

const publishExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ status: 'error', message: 'Exam not found.' });
    if (exam.questions.length === 0)
      return res.status(400).json({ status: 'error', message: 'Add at least one question before publishing.' });
    exam.status = exam.status === 'published' ? 'draft' : 'published';
    if (exam.status === 'published') exam.publishedAt = new Date();
    await exam.save();
    res.json({ status: 'success', data: exam });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    await Result.deleteMany({ exam: req.params.id });
    res.json({ status: 'success', message: 'Exam deleted.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const getExamResults = async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.id })
      .populate('student', 'fullName admissionNumber class')
      .sort({ score: -1 });
    res.json({ status: 'success', data: results });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ─── Student ──────────────────────────────────────────────────────────────────

const studentListExams = async (req, res) => {
  try {
    const student = await Student.findById(req.user.referenceId);
    if (!student) return res.status(404).json({ status: 'error', message: 'Student not found.' });

    const exams = await Exam.find({
      status: 'published',
      class: student.class,
    }).select('-questions.answer').sort({ publishedAt: -1 });

    // Attach attempt info
    const attemptedIds = (await Result.find({ student: student._id }).select('exam')).map(r => r.exam.toString());

    const data = exams.map(e => ({
      ...e.toObject(),
      attempted: attemptedIds.includes(e._id.toString()),
    }));

    res.json({ status: 'success', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const studentGetExam = async (req, res) => {
  try {
    const student = await Student.findById(req.user.referenceId);
    const already = await Result.findOne({ student: student._id, exam: req.params.id });
    if (already) return res.status(400).json({ status: 'error', message: 'You have already submitted this exam.' });

    const exam = await Exam.findOne({ _id: req.params.id, status: 'published' })
      .select('-questions.answer'); // never send answers to client
    if (!exam) return res.status(404).json({ status: 'error', message: 'Exam not found or not available.' });

    res.json({ status: 'success', data: exam });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const submitExam = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const student = await Student.findById(req.user.referenceId);

    const already = await Result.findOne({ student: student._id, exam: req.params.id });
    if (already) return res.status(400).json({ status: 'error', message: 'Already submitted.' });

    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ status: 'error', message: 'Exam not found.' });

    // Grade
    let score = 0;
    exam.questions.forEach((q, i) => {
      if (answers[i] !== undefined && answers[i] === q.answer) {
        score += q.mark || 1;
      }
    });

    const result = new Result({
      student: student._id,
      exam: exam._id,
      answers,
      score,
      totalMarks: exam.totalMarks,
      timeTaken: timeTaken || 0,
    });
    await result.save();

    res.status(201).json({ status: 'success', data: result });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

const studentResults = async (req, res) => {
  try {
    const student = await Student.findById(req.user.referenceId);
    const results = await Result.find({ student: student._id })
      .populate('exam', 'title subject class duration totalMarks')
      .sort({ submittedAt: -1 });
    res.json({ status: 'success', data: results });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  listExams, getExam, createExam, updateExam, publishExam, deleteExam, getExamResults,
  studentListExams, studentGetExam, submitExam, studentResults,
};
