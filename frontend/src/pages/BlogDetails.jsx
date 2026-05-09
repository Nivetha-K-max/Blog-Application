import { Heart, Pencil, Trash2, Calendar, Clock, MessageCircle, ArrowLeft, Tag } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { getErrorMessage } from '../utils/errors.js';
import '../styles/BlogDetails.css';

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [deleting, setDeleting] = useState(false);
  const didScroll = useRef(false);

  useEffect(() => { didScroll.current = false; load(); }, [id]);

  async function load() {
    const [blogRes, commentRes] = await Promise.all([
      api.get(`/blogs/${id}`),
      api.get(`/comments/blog/${id}`),
    ]);
    setBlog(blogRes.data);
    setComments(commentRes.data);
  }

  // Scroll to hash anchor after blog loads
  useEffect(() => {
    if (!blog || didScroll.current) return;
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      didScroll.current = true;
    }
  }, [blog]);

  async function addComment(e) {
    e.preventDefault();
    try {
      await api.post('/comments', { blogId: Number(id), comment });
      setComment('');
      load();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  }

  async function like() {
    try {
      const { data } = await api.post(`/blogs/${id}/like`);
      setBlog(data);
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  }

  async function remove() {
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    await api.delete(`/blogs/${id}`);
    navigate('/');
  }

  const readingTime = useMemo(() => {
    const words = String(blog?.content || '').trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  }, [blog]);

  if (!blog) return <div className="bd-loading"><div className="spinner" /></div>;

  const canEdit = user?.role === 'ADMIN' || user?.id === blog.author?.id;
  const authorName = blog.author?.name ?? blog.authorName ?? 'Unknown';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const category = blog.category ?? blog.categoryName ?? 'Uncategorized';
  const imageUrl = blog.imageUrl ||
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&h=600&fit=crop&auto=format';
  const publishedAt = blog.publishDate || blog.publishedAt || blog.createdAt;
  const publishedLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;
  const tags = Array.isArray(blog.tags) ? blog.tags : [];

  // Determine if current user has liked this post
  const likedByUsers = blog.likedByUsers ?? [];
  const hasLiked = user ? likedByUsers.includes(user.id) : false;

  return (
    <div className="bd-page">
      <Toast message={message} type="error" />

      {/* Hero */}
      <div className="bd-hero" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="bd-hero-overlay" />
        <div className="bd-hero-content">
          <button className="bd-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <span className="bd-category">{category}</span>
          <h1 className="bd-title">{blog.title}</h1>
          <p className="bd-subtitle">{blog.description}</p>
          <div className="bd-meta">
            <div className="bd-author">
              <div className="bd-avatar">{authorInitial}</div>
              <span>{authorName}</span>
            </div>
            <span className="bd-meta-sep" />
            {publishedLabel && <span><Calendar size={14} /> {publishedLabel}</span>}
            <span><Clock size={14} /> {readingTime}</span>
            <span><MessageCircle size={14} /> {comments.length} comments</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bd-action-bar">
        <div className="bd-action-bar-inner container">
          <div className="bd-actions-left">
            {/* Like button — scrolls to #likes and toggles */}
            <button
              id="likes"
              className={`bd-action-btn ${hasLiked ? 'liked' : ''}`}
              onClick={like}
              disabled={!isAuthenticated}
              title={isAuthenticated ? (hasLiked ? 'Unlike' : 'Like') : 'Login to like'}
            >
              <Heart size={17} fill={hasLiked ? 'currentColor' : 'none'} />
              <span>{blog.likes ?? 0}</span>
            </button>
            {/* Comment count — scrolls to #comments */}
            <button
              className="bd-action-btn passive"
              onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MessageCircle size={17} />
              <span>{comments.length}</span>
            </button>
          </div>
          {canEdit && (
            <div className="bd-actions-right">
              <Link to={`/blogs/${id}/edit`} className="bd-edit-btn">
                <Pencil size={15} /> Edit
              </Link>
              <button className="bd-delete-btn" onClick={remove} disabled={deleting}>
                <Trash2 size={15} /> {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="bd-body container">
        <div className="bd-layout">
          <main className="bd-content-area">
            <div className="bd-content">{blog.content}</div>
            {tags.length > 0 && (
              <div className="bd-tags">
                <Tag size={14} />
                {tags.map(t => <span key={t} className="bd-tag">{t}</span>)}
              </div>
            )}
          </main>

          <aside className="bd-sidebar">
            <div className="bd-sidebar-card">
              <div className="bd-sidebar-avatar">{authorInitial}</div>
              <h3 className="bd-sidebar-name">{authorName}</h3>
              <p className="bd-sidebar-label">Author</p>
              {publishedLabel && (
                <p className="bd-sidebar-date"><Calendar size={13} /> {publishedLabel}</p>
              )}
            </div>
            <div className="bd-sidebar-card">
              <h4 className="bd-sidebar-section-title">Post Info</h4>
              <ul className="bd-sidebar-info">
                <li><Clock size={13} /> {readingTime}</li>
                <li><Tag size={13} /> {category}</li>
                <li>
                  <Heart size={13} />
                  <button className="bd-sidebar-link" onClick={() => document.getElementById('likes')?.scrollIntoView({ behavior: 'smooth' })}>
                    {blog.likes ?? 0} likes
                  </button>
                </li>
                <li>
                  <MessageCircle size={13} />
                  <button className="bd-sidebar-link" onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}>
                    {comments.length} comments
                  </button>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Comments */}
        <section className="bd-comments" id="comments">
          <h2 className="bd-comments-title">
            <MessageCircle size={20} /> Comments
            <span className="bd-comments-count">{comments.length}</span>
          </h2>

          {isAuthenticated ? (
            <form onSubmit={addComment} className="bd-comment-form">
              <div className="bd-comment-form-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <div className="bd-comment-form-right">
                <textarea
                  required
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                />
                <button type="submit" className="btn btn-primary bd-comment-submit">
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="bd-login-prompt">
              <Link to="/login" className="btn btn-primary">Login to comment</Link>
            </div>
          )}

          <div className="bd-comment-list">
            {comments.length === 0 ? (
              <div className="bd-no-comments">
                <MessageCircle size={32} />
                <p>No comments yet. Be the first!</p>
              </div>
            ) : (
              comments.map(item => {
                const cInitial = (item.user?.name ?? 'U').charAt(0).toUpperCase();
                const cDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : null;
                return (
                  <div className="bd-comment" key={item.id}>
                    <div className="bd-comment-avatar">{cInitial}</div>
                    <div className="bd-comment-body">
                      <div className="bd-comment-header">
                        <strong>{item.user?.name ?? 'Unknown'}</strong>
                        {cDate && <span className="bd-comment-date">{cDate}</span>}
                      </div>
                      <p>{item.comment}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
