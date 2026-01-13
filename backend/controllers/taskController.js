const Task = require('../models/Task');
const Activity = require('../models/Activity');

/**
 * Get all tasks for logged-in user
 * @route   GET /api/tasks?status=pending
 * @access  Private (requires authentication)
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.status] - Filter by status (pending, in-progress, completed)
 * @param {Object} res - Express response object
 * @returns {Array} JSON array of task objects
 * @description Retrieves all non-deleted tasks for authenticated user with optional status filter
 */
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build query - exclude soft-deleted tasks
    const query = { user: req.user._id, is_deleted: false };
    
    // Add status filter if provided
    if (status) {
      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be: pending, in-progress, or completed' });
      }
      query.status = status;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private (requires authentication)
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Task ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON task object
 * @description Retrieves a single non-deleted task if it belongs to authenticated user
 */
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, is_deleted: false });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task belongs to logged-in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create new task
 * @route   POST /api/tasks
 * @access  Private (requires authentication)
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.title - Task title
 * @param {string} req.body.description - Task description
 * @param {string} [req.body.status] - Task status (defaults to 'pending')
 * @param {Date} req.body.due_date - Task due date
 * @param {Object} res - Express response object
 * @returns {Object} JSON created task object
 * @description Creates a new task and logs the activity
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !due_date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      due_date,
      user: req.user._id
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      action: 'task_created',
      taskTitle: title,
      details: `Created task: ${title}`
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update task
 * @route   PUT /api/tasks/:id
 * @access  Private (requires authentication)
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Task ID to update
 * @param {Object} req.body - Request body with fields to update
 * @param {Object} res - Express response object
 * @returns {Object} JSON updated task object
 * @description Updates task fields and logs activity (status_changed or task_updated)
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task belongs to logged-in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const oldStatus = task.status;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Log activity if status changed
    if (req.body.status && oldStatus !== req.body.status) {
      await Activity.create({
        user: req.user._id,
        action: 'status_changed',
        taskTitle: task.title,
        details: `Changed status from ${oldStatus} to ${req.body.status}`,
        oldStatus: oldStatus,
        newStatus: req.body.status
      });
    } else {
      await Activity.create({
        user: req.user._id,
        action: 'task_updated',
        taskTitle: task.title,
        details: `Updated task: ${task.title}`
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete task (soft delete)
 * @route   DELETE /api/tasks/:id
 * @access  Private (requires authentication)
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Task ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON success message
 * @description Soft deletes task by setting is_deleted flag and logs activity
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task belongs to logged-in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Log activity before soft deletion
    await Activity.create({
      user: req.user._id,
      action: 'task_deleted',
      taskTitle: task.title,
      details: `Deleted task: ${task.title}`
    });

    // Soft delete - just mark as deleted
    task.is_deleted = true;
    await task.save();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user activities (last 5)
 * @route   GET /api/tasks/activities
 * @access  Private (requires authentication)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} JSON array of last 5 activity objects
 * @description Retrieves the 5 most recent activities for authenticated user
 */
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getActivities
};
