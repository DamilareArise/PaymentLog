const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, trim: true },
  schoolType: { type: String, enum: ['Nursery', 'Primary', 'Secondary'], required: true },
  classes: [String],
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
