const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks?status=pending
// @access  Private
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

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
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

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
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

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
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

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
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

// Get user activities (last 5)
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
