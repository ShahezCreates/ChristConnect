const mongoose = require('mongoose');

module.exports = mongoose.model('Event', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  startsAt: { type: Date, required: true },
  endsAt: Date,
  location: { type: String, required: true, trim: true },
  category: { type: String, default: 'general', trim: true },
  registrationUrl: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }));
