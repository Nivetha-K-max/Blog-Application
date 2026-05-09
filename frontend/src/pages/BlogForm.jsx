import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PenSquare, Image, Tag, AlignLeft, Type, FileText, Link as LinkIcon } from 'lucide-react';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';
import { getErrorMessage } from '../utils/errors.js';
import '../styles/BlogForm.css';

const CATEGORIES = ['Technology', 'Programming', 'Cloud Computing', 'React', 'Spring Boot', 'DevOps', 'AI', 'Travel', 'Other'];
const empty = { title: '', description: '', content: '', category: '', imageUrl: '', tags: '' };

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/blogs/${id}`).then(({ data }) => {
        setForm({ ...data, tags: data.tags?.join(', ') || '' });
      });
    }
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      const { data } = id ? await api.put(`/blogs/${id}`, payload) : await api.post('/blogs', payload);
      navigate(`/blogs/${data.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const previewImg = !imgError && form.imageUrl ? form.imageUrl : null;

  return (
    <div className="blogform-page">
      <div className="blogform-bg" />
      <div className="blogform-container">
        <Toast message={error} type="error" />

        <div className="blogform-header">
          <div className="blogform-header-icon"><PenSquare size={22} /></div>
          <div>
            <h1>{id ? 'Edit Post' : 'Write a New Post'}</h1>
            <p>{id ? 'Update your story' : 'Share your ideas with the world'}</p>
          </div>
        </div>

        <form onSubmit={submit} className="blogform-card">
          {/* Image Preview */}
          {previewImg && (
            <div className="blogform-preview">
              <img src={previewImg} alt="Preview" onError={() => setImgError(true)} />
            </div>
          )}

          <div className="blogform-field">
            <label><Type size={15} /> Title</label>
            <input required placeholder="Give your post a great title..." value={form.title}
              onChange={e => set('title', e.target.value)} />
          </div>

          <div className="blogform-field">
            <label><FileText size={15} /> Description</label>
            <input required maxLength="500" placeholder="A short summary of your post..." value={form.description}
              onChange={e => set('description', e.target.value)} />
          </div>

          <div className="blogform-row">
            <div className="blogform-field">
              <label><Tag size={15} /> Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} required>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="blogform-field">
              <label><Tag size={15} /> Tags</label>
              <input placeholder="react, tutorial, tips..." value={form.tags}
                onChange={e => set('tags', e.target.value)} />
            </div>
          </div>

          <div className="blogform-field">
            <label><LinkIcon size={15} /> Cover Image URL</label>
            <input placeholder="https://images.unsplash.com/..." value={form.imageUrl || ''}
              onChange={e => { set('imageUrl', e.target.value); setImgError(false); }} />
          </div>

          <div className="blogform-field">
            <label><AlignLeft size={15} /> Content</label>
            <textarea required placeholder="Write your story here..." value={form.content}
              onChange={e => set('content', e.target.value)} />
          </div>

          <div className="blogform-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <PenSquare size={16} /> {saving ? 'Publishing...' : id ? 'Save Changes' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
