const Subject = require('../models/subject.model');

const getAllSubjects = async (req, res) => {
  try {
    const { schoolType } = req.query;
    const query = schoolType ? { schoolType } : {};
    const subjects = await Subject.find(query).sort({ schoolType: 1, name: 1 }).populate('teacherId', 'fullName').lean();
    res.json({ status: 'success', data: subjects });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({ status: 'success', data: subject });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ status: 'error', message: 'Subject not found.' });
    res.json({ status: 'success', data: subject });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ status: 'error', message: 'Subject not found.' });
    res.json({ status: 'success', message: 'Subject deleted.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { getAllSubjects, createSubject, updateSubject, deleteSubject };
