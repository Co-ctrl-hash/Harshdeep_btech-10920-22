import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ActivityLog from '../components/ActivityLog';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskAPI.createTask(taskData);
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskAPI.updateTask(editingTask._id, taskData);
      fetchTasks();
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Add visual feedback
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedTask || draggedTask.status === newStatus) {
      return;
    }

    // Optimistic update - update UI immediately
    const previousTasks = [...tasks];
    const updatedTasks = tasks.map(task => 
      task._id === draggedTask._id ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    try {
      await taskAPI.updateTask(draggedTask._id, {
        ...draggedTask,
        status: newStatus
      });
      // Success - fetch fresh data to ensure consistency
      fetchTasks();
    } catch (error) {
      // Rollback on error
      console.error('Error updating task status:', error);
      setTasks(previousTasks);
      alert('Failed to update task status. Changes have been reverted.');
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div>
      <nav className="navbar">
        <h1>📋 Task Manager</h1>
        <div className="navbar-right">
          <span className="user-name">Welcome, {user?.name || 'User'}!</span>
          <button className="btn-profile" onClick={() => navigate('/profile')}>
            Profile
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <button 
          className="btn-add" 
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        >
          + Add New Task
        </button>

        <div className="kanban-board">
          {/* Pending Column */}
          <div 
            className="kanban-column column-pending"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'pending')}
          >
            <div className="column-header">
              📌 Pending ({getTasksByStatus('pending').length})
            </div>
            {getTasksByStatus('pending').map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>

          {/* In Progress Column */}
          <div 
            className="kanban-column column-in-progress"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'in-progress')}
          >
            <div className="column-header">
              🚀 In Progress ({getTasksByStatus('in-progress').length})
            </div>
            {getTasksByStatus('in-progress').map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>

          {/* Completed Column */}
          <div 
            className="kanban-column column-completed"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'completed')}
          >
            <div className="column-header">
              ✅ Completed ({getTasksByStatus('completed').length})
            </div>
            {getTasksByStatus('completed').map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <ActivityLog />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
        task={editingTask}
      />
    </div>
  );
}

export default Dashboard;
