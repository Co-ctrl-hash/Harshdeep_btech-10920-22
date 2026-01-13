const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfile, deleteProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Private routes (require login)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

module.exports = router;
