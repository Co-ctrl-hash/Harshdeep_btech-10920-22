const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getActivities
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Get user activities
router.get('/activities', protect, getActivities);

// All routes are protected (require login)
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
