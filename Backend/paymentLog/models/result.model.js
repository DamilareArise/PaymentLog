const mongoose = require('mongoose');

const gradeFromPercent = (pct) => {
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 45) return 'D';
  return 'F';
};

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers: [{ type: Number }], // index of chosen option per question; -1 = skipped
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  grade: { type: String, default: 'F' },
  timeTaken: { type: Number, default: 0 }, // seconds
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// One attempt per student per exam
resultSchema.index({ student: 1, exam: 1 }, { unique: true });

resultSchema.pre('save', function (next) {
  this.percentage = this.totalMarks > 0
    ? Math.round((this.score / this.totalMarks) * 100)
    : 0;
  this.grade = gradeFromPercent(this.percentage);
  next();
});

module.exports = mongoose.model('Result', resultSchema);
