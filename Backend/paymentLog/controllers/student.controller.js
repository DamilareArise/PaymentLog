const Student = require('../models/student.model');

const generateAdmissionNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Student.countDocuments({ admissionNumber: { $regex: `OOS/${year}/` } });
  return `OOS/${year}/${String(count + 1).padStart(3, '0')}`;
};

const getAllStudents = async (req, res) => {
  try {
    const { search, schoolType, class: cls, admissionStatus, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.fullName = { $regex: search, $options: 'i' };
    if (schoolType) query.schoolType = schoolType;
    if (cls) query.class = cls;
    if (admissionStatus) query.admissionStatus = admissionStatus;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.json({ status: 'success', data: students, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) return res.status(404).json({ status: 'error', message: 'Student not found.' });
    res.json({ status: 'success', data: student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const admissionNumber = await generateAdmissionNumber();
    const student = new Student({ ...req.body, admissionNumber });
    await student.save();
    res.status(201).json({ status: 'success', data: student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ status: 'error', message: 'Student not found.' });
    res.json({ status: 'success', data: student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ status: 'error', message: 'Student not found.' });
    res.json({ status: 'success', message: 'Student deleted.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const updateAdmissionStatus = async (req, res) => {
  try {
    const { admissionStatus } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, { admissionStatus }, { new: true });
    if (!student) return res.status(404).json({ status: 'error', message: 'Student not found.' });
    res.json({ status: 'success', data: student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Public: submit admission application
const submitApplication = async (req, res) => {
  try {
    const student = new Student({ ...req.body, admissionStatus: 'pending' });
    await student.save();
    res.status(201).json({ status: 'success', data: { admissionNumber: student.admissionNumber, id: student._id }, message: 'Application submitted successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Student: get own profile
const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.referenceId).lean();
    if (!student) return res.status(404).json({ status: 'error', message: 'Student profile not found.' });
    res.json({ status: 'success', data: student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { getAllStudents, getStudent, createStudent, updateStudent, deleteStudent, updateAdmissionStatus, submitApplication, getMyProfile };
