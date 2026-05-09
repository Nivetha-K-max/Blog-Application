import { useEffect, useState } from 'react';
import { Users, FileText, MessageCircle, Trash2, UserX, UserCheck, Shield, TrendingUp } from 'lucide-react';
import api from '../services/api.js';
import '../styles/AdminDashboard.css';

const STAT_ICONS = { users: Users, blogs: FileText, comments: MessageCircle };

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id) {
    setActionId(id);
    try {
      const { data } = await api.post(`/admin/users/${id}/toggle-active`);
      setUsers(prev => prev.map(u => u.id === id ? data : u));
    } catch (e) {
      setError(e?.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  }

  async function deleteUser(id, name) {
    if (!window.confirm(`Permanently delete "${name}" and all their posts? This cannot be undone.`)) return;
    setActionId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      setStats(prev => ({ ...prev, users: (prev.users ?? 1) - 1 }));
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-bg" />
      <div className="admin-container">

        <div className="admin-header">
          <div className="admin-header-icon"><Shield size={22} /></div>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage users and monitor platform activity</p>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loading">
            {[...Array(3)].map((_, i) => <div key={i} className="admin-skeleton" />)}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="admin-stats">
              {Object.entries(stats).map(([key, value]) => {
                const Icon = STAT_ICONS[key] ?? TrendingUp;
                return (
                  <div className="admin-stat-card" key={key}>
                    <div className="admin-stat-icon"><Icon size={20} /></div>
                    <div>
                      <strong>{value}</strong>
                      <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Users Table */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2><Users size={18} /> Users <span className="admin-count">{users.length}</span></h2>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className={!u.active ? 'row-inactive' : ''}>
                        <td>
                          <div className="user-cell">
                            <div className="user-cell-avatar">{u.name.charAt(0).toUpperCase()}</div>
                            <div>
                              <div className="user-cell-name">{u.name}</div>
                              <div className="user-cell-username">@{u.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="td-email">{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role === 'ADMIN' ? 'admin' : 'user'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.active ? 'active' : 'inactive'}`}>
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button
                              className={`action-btn ${u.active ? 'deactivate' : 'activate'}`}
                              onClick={() => toggleActive(u.id)}
                              disabled={actionId === u.id}
                              title={u.active ? 'Deactivate user' : 'Activate user'}
                            >
                              {u.active ? <UserX size={15} /> : <UserCheck size={15} />}
                              {u.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => deleteUser(u.id, u.name)}
                              disabled={actionId === u.id}
                              title="Delete user permanently"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
