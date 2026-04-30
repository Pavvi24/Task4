import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser } from '../../api';
import { toast } from 'react-toastify';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchUsers = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getAllUsers({ page: p, limit: 20 });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(page); }, [page]);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    try {
      await updateUser(user._id, { role: newRole });
      toast.success('User role updated');
      fetchUsers(page);
    } catch { toast.error('Failed to update user'); }
  };

  const toggleActive = async (user) => {
    try {
      await updateUser(user._id, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers(page);
    } catch { toast.error('Failed to update user'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Users</h2>
          <p>{pagination.total || 0} registered users</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <>
          <div className="card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-mini">{user.name?.[0]?.toUpperCase()}</div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="date-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button onClick={() => toggleRole(user)} className="btn btn-sm btn-secondary">
                          {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => toggleActive(user)}
                          className="btn btn-sm"
                          style={{ background: user.isActive ? '#fee2e2' : '#dcfce7', color: user.isActive ? '#dc2626' : '#16a34a' }}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i+1).map(p => (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;
