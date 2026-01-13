function TaskCard({ task, onEdit, onDelete, onDragStart, onDragEnd }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDueDateStatus = (dateString) => {
    if (!dateString) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { label: 'Overdue', className: 'overdue' };
    } else if (diffDays === 0) {
      return { label: 'Due Today', className: 'due-today' };
    } else if (diffDays <= 3) {
      return { label: 'Due Soon', className: 'due-soon' };
    }
    return null;
  };

  const handleDragStart = (e) => {
    e.currentTarget.style.opacity = '0.4';
    onDragStart(e, task);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
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
