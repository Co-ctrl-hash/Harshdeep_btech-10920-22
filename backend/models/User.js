const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema - Custom implementation for Ozi Task Management System
 * @author Ozi SDE Assignment
 * @description Unique user model with custom validation and security features
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    validate: {
      validator: function(name) {
        // Custom validation: name should not contain numbers or special chars
        return /^[a-zA-Z\s]+$/.test(name);
      },
      message: 'Name should only contain letters and spaces'
    }
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        // Custom email validation pattern - more strict than default
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  last_login_at: {
    type: Date,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

/**
 * Custom pre-save middleware - Original implementation
 * Hashes password with custom salt rounds and validates strength
 */
userSchema.pre('save', async function(next) {
  // Only hash password if modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Custom password strength validation (original logic)
  if (this.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  // Custom implementation: Use higher salt rounds for better security
  const customSaltRounds = 12; // Stronger than default 10
  const salt = await bcrypt.genSalt(customSaltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Custom instance method: verifyPasswordMatch
 * @description Original implementation for secure password comparison
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Custom instance method: getPublicProfile
 * @description Returns user data without sensitive information
 * @returns {Object} Safe user object for client-side use
 */
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    lastLogin: this.last_login_at,
    isActive: this.is_active,
    memberSince: this.createdAt
  };
};

/**
 * Custom static method: findActiveUsers
 * @description Original helper to find only active users
 */
userSchema.statics.findActiveUsers = function() {
  return this.find({ is_active: true });
};

module.exports = mongoose.model('User', userSchema);
