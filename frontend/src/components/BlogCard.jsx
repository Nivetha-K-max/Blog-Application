import { Heart, MessageCircle, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function readTime(content) {
  const words = (content || '').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogCard({ blog }) {
  const category = blog.category ?? blog.categoryName ?? 'Uncategorized';
  const authorName = blog.author?.name ?? blog.authorName ?? 'Unknown';
  const initial = authorName.charAt(0).toUpperCase();
  const imageUrl =
    blog.imageUrl ||
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="blog-card">
      <Link to={`/blogs/${blog.id}`} className="blog-card-img-wrap">
        <img src={imageUrl} alt={blog.title} loading="lazy" />
        <span className="blog-card-category">{category}</span>
      </Link>

      <div className="blog-card-body">
        <h2 className="blog-card-title">
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </h2>
        <p className="blog-card-desc">{blog.description}</p>

        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="author-avatar">{initial}</div>
            <span className="author-name">{authorName}</span>
          </div>
          <div className="blog-card-stats">
            <span><Clock size={13} /> {readTime(blog.content)} min</span>
            <span><Heart size={13} /> {blog.likes ?? 0}</span>
            <span><MessageCircle size={13} /> {blog.commentCount ?? 0}</span>
          </div>
        </div>

        {blog.createdAt && (
          <div className="blog-card-date">
            <Calendar size={12} /> {formatDate(blog.createdAt)}
          </div>
        )}
      </div>
    </article>
  );
}
