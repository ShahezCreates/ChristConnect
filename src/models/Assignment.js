const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  dueAt: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true },
  originalName: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = { Assignment: mongoose.model('Assignment', assignmentSchema), Submission: mongoose.model('Submission', submissionSchema) };
