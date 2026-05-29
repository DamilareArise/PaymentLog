const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true, trim: true },
  staffId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['admin', 'teacher'], required: true },
  email: { type: String, required: true },
  phone: String,
  address: String,
  subjects: [String],
  photo: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
