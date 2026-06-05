const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], validate: v => v.length === 4 },
  answer: { type: Number, min: 0, max: 3, required: true }, // index of correct option
  mark: { type: Number, default: 1 },
}, { _id: true });

const examSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  schoolType: { type: String, enum: ['Nursery', 'Primary', 'Secondary'], required: true },
  duration: { type: Number, required: true }, // minutes
  instructions: { type: String, default: '' },
  questions: [questionSchema],
  totalMarks: { type: Number, default: 0 },
  passMark: { type: Number, default: 50 }, // percentage
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  publishedAt: Date,
}, { timestamps: true });

// Keep totalMarks in sync with questions
examSchema.pre('save', function (next) {
  this.totalMarks = this.questions.reduce((sum, q) => sum + (q.mark || 1), 0);
  next();
});

module.exports = mongoose.model('Exam', examSchema);
