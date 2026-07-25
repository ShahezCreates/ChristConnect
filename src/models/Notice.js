const mongoose = require('mongoose');

module.exports = mongoose.model('Notice', new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  content: { type: String, required: true, trim: true, maxlength: 4000 },
  category: { type: String, enum: ['academic', 'exam', 'event', 'general'], default: 'general' },
  pinned: { type: Boolean, default: false },
  expiresAt: Date,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }));
