const Staff = require('../models/staff.model');

const generateStaffId = async () => {
  const count = await Staff.countDocuments();
  return `OOS/STF/${String(count + 1).padStart(3, '0')}`;
};

const getAllStaff = async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};
    if (search) query.fullName = { $regex: search, $options: 'i' };
    if (role) query.role = role;

    const staff = await Staff.find(query).sort({ createdAt: -1 }).lean();
    res.json({ status: 'success', data: staff });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const getStaffMember = async (req, res) => {
  try {
    const member = await Staff.findById(req.params.id).lean();
    if (!member) return res.status(404).json({ status: 'error', message: 'Staff not found.' });
    res.json({ status: 'success', data: member });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const createStaff = async (req, res) => {
  try {
    const staffId = await generateStaffId();
    const member = new Staff({ ...req.body, staffId });
    await member.save();
    res.status(201).json({ status: 'success', data: member });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const member = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ status: 'error', message: 'Staff not found.' });
    res.json({ status: 'success', data: member });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const member = await Staff.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ status: 'error', message: 'Staff not found.' });
    res.json({ status: 'success', message: 'Staff member deleted.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const toggleActive = async (req, res) => {
  try {
    const member = await Staff.findById(req.params.id);
    if (!member) return res.status(404).json({ status: 'error', message: 'Staff not found.' });
    member.isActive = !member.isActive;
    await member.save();
    res.json({ status: 'success', data: member });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { getAllStaff, getStaffMember, createStaff, updateStaff, deleteStaff, toggleActive };
