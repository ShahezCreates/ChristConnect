const mongoose = require('mongoose');

module.exports = mongoose.model('Course', new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  credits: { type: Number, min: 0, max: 12, default: 4 },
  semester: { type: Number, min: 1, max: 10, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true }));
