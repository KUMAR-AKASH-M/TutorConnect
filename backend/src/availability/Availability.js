const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: [true, 'Day of week is required'],
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required (HH:MM format)'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide a valid time in HH:MM format'],
  },
  endTime: {
    type: String,
    required: [true, 'End time is required (HH:MM format)'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide a valid time in HH:MM format'],
  }
}, { timestamps: true });

// Prevent exact duplicate blocks for same day and tutor
availabilitySchema.index({ tutor: 1, dayOfWeek: 1, startTime: 1, endTime: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
