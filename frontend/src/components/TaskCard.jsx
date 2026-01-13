/**
 * TaskCard Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object with title, description, due_date
 * @param {Function} props.onEdit - Callback when edit button clicked
 * @param {Function} props.onDelete - Callback when delete button clicked
 * @param {Function} props.onDragStart - Callback when drag starts
 * @param {Function} props.onDragEnd - Callback when drag ends
 * @description Draggable task card with due-date intelligence
 * @returns {JSX.Element} Task card component
 */
function TaskCard({ task, onEdit, onDelete, onDragStart, onDragEnd }) {
  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date (e.g., "Jan 13, 2026")
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  /**
   * Determine due date status and styling
   * @param {string} dateString - ISO date string
   * @returns {Object|null} Status object with label and className, or null
   * @description Calculates days until due and returns appropriate status
   */
  const getDueDateStatus = (dateString) => {
    if (!dateString) return null;
    
    // Normalize dates to midnight for accurate day comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Return status based on days remaining
    if (diffDays < 0) {
      return { label: 'Overdue', className: 'overdue' };
    } else if (diffDays === 0) {
      return { label: 'Due Today', className: 'due-today' };
    } else if (diffDays <= 3) {
      return { label: 'Due Soon', className: 'due-soon' };
    }
    return null; // No badge for tasks due > 3 days
  };

  /**
   * Handle drag start event
   * @param {DragEvent} e - Drag event
   */
  const handleDragStart = (e) => {
    e.currentTarget.style.opacity = '0.4'; // Visual feedback
    onDragStart(e, task);
  };

  /**
   * Handle drag end event
   * @param {DragEvent} e - Drag event
   */
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'; // Reset opacity
    onDragEnd();
  };

  const dueDateStatus = getDueDateStatus(task.due_date);

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-title">{task.title}</div>
      <div className="task-description">{task.description}</div>
      <div className="task-due-date">
        Due: {formatDate(task.due_date)}
        {dueDateStatus && (
          <span className={`due-badge ${dueDateStatus.className}`}>
            {dueDateStatus.label}
          </span>
        )}
      </div>
      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
