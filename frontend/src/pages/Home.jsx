import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, X, TrendingUp, PenSquare } from 'lucide-react';
import api from '../services/api.js';
import BlogCard from '../components/BlogCard.jsx';
import '../styles/Home.css';

const CATEGORY_ICONS = {
  Technology: '💻', Programming: '🧑‍💻', 'Cloud Computing': '☁️',
  React: '⚛️', 'Spring Boot': '🍃', DevOps: '🔧', AI: '🤖', Travel: '✈️',
};

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef(null);

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadBlogs(); }, [page, category]);

  const loadBlogs = async (overrideSearch) => {
    setLoading(true);
    try {
      const params = { page, size: 9 };
      const q = overrideSearch !== undefined ? overrideSearch : search;
      if (q) params.search = q;
      if (category) params.category = category;
      const res = await api.get('/blogs', { params });
      setBlogs(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error('Failed to load blogs', e);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      loadBlogs(val);
    }, 400);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    setPage(0);
    loadBlogs(search);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(0);
    loadBlogs('');
  };

  const selectCategory = (cat) => {
    setCategory(cat === category ? '' : cat);
    setPage(0);
  };

  return (
    <div className="home-container">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge"><TrendingUp size={14} /> Trending Stories</div>
          <h1 className="hero-title">Publish Your <span className="hero-highlight">Passion</span></h1>
          <p className="hero-subtitle">Create, share, and grow your ideas with the modern blogging platform</p>
          <div className="hero-actions">
            <Link to="/blogs/new" className="btn btn-primary hero-btn">
              <PenSquare size={18} /> Start Writing
            </Link>
            <button className="btn btn-secondary hero-btn" onClick={() => document.getElementById('blogs-anchor').scrollIntoView({ behavior: 'smooth' })}>
              Explore Blogs
            </button>
          </div>
        </div>
        <div className="hero-scroll-hint">↓</div>
      </section>

      {/* Search + Filters */}
      <section className="search-section" id="blogs-anchor">
        <div className="container">
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search blogs by title, content..."
                value={search}
                onChange={handleSearchChange}
              />
              {search && (
                <button type="button" className="search-clear" onClick={clearSearch}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary search-btn">Search</button>
          </form>

          {categories.length > 0 && (
            <div className="category-pills">
              <button
                className={`cat-pill ${category === '' ? 'active' : ''}`}
                onClick={() => selectCategory('')}
              >
                All
              </button>
              {categories.map((c) => {
                const name = c.name ?? c;
                return (
                  <button
                    key={c.id ?? name}
                    className={`cat-pill ${category === name ? 'active' : ''}`}
                    onClick={() => selectCategory(name)}
                  >
                    {CATEGORY_ICONS[name] ?? '📌'} {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="blogs-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <BookOpen size={24} />
              {category ? `${category} Posts` : search ? `Results for "${search}"` : 'Latest Stories'}
            </h2>
            {(search || category) && (
              <button className="btn-clear-filters" onClick={() => { clearSearch(); setCategory(''); }}>
                <X size={14} /> Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="blogs-grid">
                {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
              </div>
              <div className="pagination">
                <button className="btn btn-ghost pag-btn" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                  ← Previous
                </button>
                <div className="page-dots">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                    <button key={i} className={`page-dot ${page === i ? 'active' : ''}`} onClick={() => setPage(i)} />
                  ))}
                </div>
                <button className="btn btn-ghost pag-btn" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div className="no-blogs">
              <div className="no-blogs-icon">📭</div>
              <h3>No blogs found</h3>
              <p>{search || category ? 'Try different search terms or categories.' : 'Be the first to create one!'}</p>
              <Link to="/blogs/new" className="btn btn-primary">Create Blog</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
