import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, BookOpen, Heart, MessageCircle, Mail, AtSign, Shield, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import '../styles/Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = () => {
    api.get('/blogs/my')
      .then(({ data }) => setMyBlogs(data.content || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBlogs(); }, []);

  async function deletePost(id) {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/blogs/${id}`);
    setMyBlogs(prev => prev.filter(b => b.id !== id));
  }

  const totalLikes = myBlogs.reduce((s, b) => s + (b.likes ?? 0), 0);
  const totalComments = myBlogs.reduce((s, b) => s + (b.commentCount ?? 0), 0);
  const initial = user.name?.charAt(0).toUpperCase() ?? '?';
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="profile-page">
      {/* Hero Banner */}
      <div className="profile-banner">
        <div className="profile-banner-overlay" />
        <div className="profile-hero">
          <div className="profile-avatar-ring">
            <div className="profile-avatar">{initial}</div>
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-name">{user.name}</h1>
            <span className={`profile-role-badge ${user.role === 'ADMIN' ? 'admin' : 'user'}`}>
              <Shield size={13} /> {user.role}
            </span>
          </div>
          <Link to="/blogs/new" className="btn btn-primary profile-write-btn">
            <PenSquare size={16} /> Write a Post
          </Link>
        </div>
      </div>

      <div className="profile-body container">
        {/* Stats Row */}
        <div className="profile-stats">
          <div className="profile-stat">
            <BookOpen size={22} className="stat-icon" />
            <strong>{myBlogs.length}</strong>
            <span>Posts</span>
          </div>
          <div className="profile-stat stat-clickable" onClick={() => {
            if (myBlogs.length > 0) window.location.href = `/blogs/${myBlogs[0].id}#likes`;
          }}>
            <Heart size={22} className="stat-icon accent" />
            <strong>{totalLikes}</strong>
            <span>Likes</span>
          </div>
          <div className="profile-stat stat-clickable" onClick={() => {
            if (myBlogs.length > 0) window.location.href = `/blogs/${myBlogs[0].id}#comments`;
          }}>
            <MessageCircle size={22} className="stat-icon primary" />
            <strong>{totalComments}</strong>
            <span>Comments</span>
          </div>
        </div>

        <div className="profile-grid">
          {/* Info Card */}
          <div className="profile-card">
            <h2 className="profile-card-title">Account Info</h2>
            <ul className="profile-info-list">
              <li>
                <span className="info-label"><Mail size={15} /> Email</span>
                <span className="info-value">{user.email}</span>
              </li>
              <li>
                <span className="info-label"><AtSign size={15} /> Username</span>
                <span className="info-value">@{user.username}</span>
              </li>
              <li>
                <span className="info-label"><Shield size={15} /> Role</span>
                <span className={`info-value role-tag ${user.role === 'ADMIN' ? 'admin' : 'user'}`}>
                  {user.role}
                </span>
              </li>
              {joinDate && (
                <li>
                  <span className="info-label"><Calendar size={15} /> Joined</span>
                  <span className="info-value">{joinDate}</span>
                </li>
              )}
            </ul>
          </div>

          {/* My Posts */}
          <div className="profile-card profile-posts-card">
            <h2 className="profile-card-title">My Posts</h2>
            {loading ? (
              <div className="profile-posts-loading">
                {[...Array(3)].map((_, i) => <div key={i} className="post-skeleton" />)}
              </div>
            ) : myBlogs.length === 0 ? (
              <div className="profile-empty">
                <span className="profile-empty-icon">📝</span>
                <p>No posts yet. Start writing!</p>
                <Link to="/blogs/new" className="btn btn-primary">Create your first post</Link>
              </div>
            ) : (
              <ul className="profile-post-list">
                {myBlogs.slice(0, 8).map(blog => (
                  <li key={blog.id} className="profile-post-item">
                    <img
                      src={blog.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=120&h=80&fit=crop&auto=format'}
                      alt={blog.title}
                      className="post-thumb"
                    />
                    <div className="post-item-info">
                      <Link to={`/blogs/${blog.id}`} className="post-item-title">{blog.title}</Link>
                      <div className="post-item-meta">
                        <span><Heart size={12} /> {blog.likes ?? 0}</span>
                        <span><MessageCircle size={12} /> {blog.commentCount ?? 0}</span>
                        <span className="post-item-cat">{blog.category}</span>
                      </div>
                    </div>
                    <div className="post-item-actions">
                      <Link to={`/blogs/${blog.id}/edit`} className="post-edit-btn" title="Edit">
                        <PenSquare size={15} />
                      </Link>
                      <button className="post-delete-btn" title="Delete" onClick={() => deletePost(blog.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
