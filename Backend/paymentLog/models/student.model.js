const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true, trim: true },
  admissionNumber: { type: String, unique: true, sparse: true },
  gender: { type: String, enum: ['Male', 'Female'] },
  dateOfBirth: Date,
  class: String,
  schoolType: { type: String, enum: ['KG', 'Nursery', 'Primary', 'Secondary'] },
  section: String,
  address: String,
  parentName: String,
  parentPhone: String,
  parentEmail: String,
  photo: String,
  email: String,
  phone: String,
  admissionStatus: {
    type: String,
    enum: ['admitted', 'not_admitted', 'pending'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
