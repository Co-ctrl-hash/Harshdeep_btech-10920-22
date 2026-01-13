const mongoose = require('mongoose');

/**
 * Task Schema - Custom implementation for Ozi Kanban System
 * @author Ozi SDE Assignment
 * @description Unique task model with custom validation and business logic
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    minlength: [5, 'Description must be at least 5 characters'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  due_date: {
    type: Date,
    required: [true, 'Please add a due date'],
    validate: {
      validator: function(date) {
        // Custom validation: due date cannot be in the past (at creation)
        if (this.isNew) {
          return date >= new Date();
        }
        return true;
      },
      message: 'Due date cannot be in the past'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

/**
 * Custom instance method: isOverdue
 * @description Original implementation to check if task is overdue
 * @returns {Boolean} True if task is past due date
 */
taskSchema.methods.isOverdue = function() {
  if (this.status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(this.due_date);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

/**
 * Custom instance method: getDaysUntilDue
 * @description Calculate days remaining until due date
 * @returns {Number} Days until due (negative if overdue)
 */
taskSchema.methods.getDaysUntilDue = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(this.due_date);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = dueDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Custom static method: findOverdueTasks
 * @description Original helper to find overdue tasks for a user
 */
taskSchema.statics.findOverdueTasks = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.find({
    user: userId,
    is_deleted: false,
    status: { $ne: 'completed' },
    due_date: { $lt: today }
  });
};

/**
 * Custom pre-save hook: Auto-update timestamp on status change
 */
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
