const User = require('../models/user.model');
const Student = require('../models/student.model');
const Staff = require('../models/staff.model');
const jwt = require('jsonwebtoken');

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role, referenceId: user.referenceId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });

    if (!user.isActive)
      return res.status(401).json({ status: 'error', message: 'Account has been disabled.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });

    user.lastLogin = new Date();
    await user.save({ validateModifiedOnly: true });

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findById(user.referenceId).lean();
    } else {
      profile = await Staff.findById(user.referenceId).lean();
    }

    const token = generateToken(user);

    res.json({
      status: 'success',
      token,
      user: { id: user._id, email: user.email, role: user.role, profile }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean();
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found.' });

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findById(user.referenceId).lean();
    } else {
      profile = await Staff.findById(user.referenceId).lean();
    }

    res.json({ status: 'success', user: { ...user, profile } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ status: 'error', message: 'Both fields are required.' });

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ status: 'error', message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();

    res.json({ status: 'success', message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Admin only: create a login account linked to an existing student/staff record
const createUser = async (req, res) => {
  try {
    const { email, password, role, referenceId } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ status: 'error', message: 'email, password, and role are required.' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ status: 'error', message: 'Email already registered.' });

    const user = new User({ email, password, role, referenceId });
    await user.save();

    if (role === 'student' && referenceId) {
      await Student.findByIdAndUpdate(referenceId, { userId: user._id });
    } else if ((role === 'teacher' || role === 'admin') && referenceId) {
      await Staff.findByIdAndUpdate(referenceId, { userId: user._id });
    }

    res.status(201).json({ status: 'success', message: 'User account created.', userId: user._id });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// One-time setup: create the first admin if no admins exist
const setupAdmin = async (req, res) => {
  try {
    const existing = await User.findOne({ role: 'admin' });
    if (existing) return res.status(403).json({ status: 'error', message: 'Setup already completed.' });

    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName)
      return res.status(400).json({ status: 'error', message: 'email, password, and fullName are required.' });

    const staffMember = new Staff({ fullName, email, role: 'admin', isActive: true });
    await staffMember.save();

    const user = new User({ email, password, role: 'admin', referenceId: staffMember._id });
    await user.save();

    staffMember.userId = user._id;
    await staffMember.save();

    res.status(201).json({ status: 'success', message: 'Admin account created. You can now log in.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { login, getMe, changePassword, createUser, setupAdmin };
