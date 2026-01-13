const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['task_created', 'task_updated', 'task_deleted', 'status_changed']
  },
  taskTitle: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  oldStatus: {
    type: String
  },
  newStatus: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
