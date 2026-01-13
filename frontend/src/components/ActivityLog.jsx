import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await taskAPI.getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'task_created':
        return '✨';
      case 'task_updated':
        return '✏️';
      case 'task_deleted':
        return '🗑️';
      case 'status_changed':
        return '🔄';
      default:
        return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'task_created':
        return '#10b981';
      case 'task_updated':
        return '#3b82f6';
      case 'task_deleted':
        return '#ef4444';
      case 'status_changed':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="activity-log">
        <h3>Recent Activity</h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="activity-log">
      <h3>Recent Activity</h3>
      {activities.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '14px' }}>No activities yet</p>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity._id} className="activity-item">
              <span 
                className="activity-icon" 
                style={{ color: getActionColor(activity.action) }}
              >
                {getActionIcon(activity.action)}
              </span>
              <div className="activity-content">
                <p className="activity-details">{activity.details}</p>
                {activity.oldStatus && activity.newStatus && (
                  <p className="activity-status-change">
                    <span className="status-badge">{activity.oldStatus}</span>
                    <span className="status-arrow">→</span>
                    <span className="status-badge">{activity.newStatus}</span>
                  </p>
                )}
                <span className="activity-time">{formatTime(activity.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
