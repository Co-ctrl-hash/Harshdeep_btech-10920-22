import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Pre-fill user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Password validation
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // Only include password if provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await authAPI.updateProfile(updateData);
      
      // Update local storage with new token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const { token, ...userData } = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setSuccess('Profile updated successfully!');
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });

      // Reload page to update user context
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This will permanently delete your profile and all your tasks. This action cannot be undone.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'FINAL WARNING: This will delete everything. Are you absolutely sure?'
    );

    if (!doubleConfirm) return;

    try {
      await authAPI.deleteProfile();
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete profile');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Edit Profile</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
          
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <div className="profile-actions">
          <button className="btn-back" onClick={handleBack}>
            Back to Dashboard
          </button>
          <button className="btn-delete-account" onClick={handleDeleteProfile}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
