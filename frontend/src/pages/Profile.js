import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../api';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(profileForm);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-container">
        <div className="profile-layout">
          <aside className="profile-sidebar card">
            <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-info' : 'badge-secondary'}`}>{user?.role}</span>
            <nav className="profile-nav">
              <button className={`profile-nav-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>👤 My Profile</button>
              <button className={`profile-nav-btn ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>🔒 Change Password</button>
            </nav>
          </aside>

          <div className="profile-content">
            {tab === 'profile' && (
              <div className="card profile-form-card">
                <h2>Personal Information</h2>
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input className="form-control" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" className="form-control" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input className="form-control" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="Your phone number" />
                  </div>

                  <h3 className="section-divider">📍 Address</h3>
                  <div className="form-group">
                    <label>Street</label>
                    <input className="form-control" value={profileForm.address.street} onChange={e => setProfileForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))} />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>City</label>
                      <input className="form-control" value={profileForm.address.city} onChange={e => setProfileForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input className="form-control" value={profileForm.address.state} onChange={e => setProfileForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))} />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input className="form-control" value={profileForm.address.zipCode} onChange={e => setProfileForm(f => ({ ...f, address: { ...f.address, zipCode: e.target.value } }))} />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input className="form-control" value={profileForm.address.country} onChange={e => setProfileForm(f => ({ ...f, address: { ...f.address, country: e.target.value } }))} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'password' && (
              <div className="card profile-form-card">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" className="form-control" value={passwordForm.currentPassword} onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" className="form-control" value={passwordForm.newPassword} onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" className="form-control" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
