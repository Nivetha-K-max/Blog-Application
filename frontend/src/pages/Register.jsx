import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AtSign } from 'lucide-react';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/errors.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page auth-page--register">
      <div className="auth-card">
        <Toast message={error} type="error" />
        <div className="auth-header">
          <div className="auth-logo">✍️</div>
          <h1>Join BlogFlow</h1>
          <p>Create your account and start writing</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <div className="input-group">
            <User size={17} className="input-icon" />
            <input required placeholder="Full name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="input-group">
            <Mail size={17} className="input-icon" />
            <input required type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="input-group">
            <AtSign size={17} className="input-icon" />
            <input required placeholder="Username" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="input-group">
            <Lock size={17} className="input-icon" />
            <input required minLength="8" type="password" placeholder="Password (min 8 chars)" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="role-select">
            <label>Account type</label>
            <div className="role-options">
              {['USER', 'ADMIN'].map((r) => (
                <button key={r} type="button"
                  className={`role-option ${form.role === r ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: r })}>
                  {r === 'USER' ? '👤 User' : '🛡️ Admin'}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            <UserPlus size={17} /> {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
