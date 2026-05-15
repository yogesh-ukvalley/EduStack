const mongoose = require('mongoose');

const VALID_COURSES = ['A1', 'A2', 'B1', 'B2'];

const VALID_STATUSES = [
  'New Lead',
  'Connected',
  'Interested',
  'Follow-up Required',
  'Follow-up Set',
  'Qualified',
  'Not Interested',
  'Other'
];

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mobileNo: {
    type: String,
    required: true,
    trim: true
  },
  courses: {
    type: [String],
    required: true,
    enum: VALID_COURSES,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one course must be selected'
    }
  },
  status: {
    type: String,
    enum: VALID_STATUSES,
    default: 'New Lead'
  },
  statusNote: {
    type: String,
    default: ''
  },
  followUpDate: {
    type: Date,
    default: null
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
contactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Contact', contactSchema);