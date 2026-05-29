const Student = require('../models/student.model');
const Staff = require('../models/staff.model');
const Subject = require('../models/subject.model');

const getStats = async (req, res) => {
  try {
    const [totalStudents, totalStaff, totalSubjects, pendingAdmissions, admittedStudents, recentStudents, recentApplications] = await Promise.all([
      Student.countDocuments({ admissionStatus: 'admitted' }),
      Staff.countDocuments({ isActive: true }),
      Subject.countDocuments(),
      Student.countDocuments({ admissionStatus: 'pending' }),
      Student.countDocuments({ admissionStatus: 'admitted' }),
      Student.find({ admissionStatus: 'admitted' }).sort({ createdAt: -1 }).limit(5).select('fullName class schoolType admissionNumber createdAt').lean(),
      Student.find({ admissionStatus: 'pending' }).sort({ createdAt: -1 }).limit(5).select('fullName class schoolType createdAt').lean()
    ]);

    res.json({
      status: 'success',
      data: { totalStudents, totalStaff, totalSubjects, pendingAdmissions, admittedStudents, recentStudents, recentApplications }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { getStats };
