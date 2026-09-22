import { Link, useParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useTitle } from '../utils';
import PostBody from './PostBody';

export default function Post() {
  const { postId } = useParams();
  const { posts, loading } = usePosts();
  const post = posts.find((p) => String(p.n) === String(postId) || p.slug === postId);

  useTitle(post?.title || (loading ? 'טוען' : 'מתכון לא נמצא'));

  if (loading) {
    return (
      <section className="hero wrap">
        <p className="center">טוען מתכון...</p>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="hero wrap">
        <h1>המתכון לא נמצא</h1>
        <p><Link className="back-link" to="/blog">← חזרה למתכונים</Link></p>
      </section>
    );
  }

  return (
    <article>
      <header className="post__header wrap">
        <Link className="back-link" to="/blog">← חזרה למתכונים</Link>
        <h1>{post.title}</h1>
        <div className="post__meta">
          {post.date && <span>{post.date}</span>}
          {post.readtime && <span>{post.readtime}</span>}
          {post.category && <span>{post.category}</span>}
        </div>
      </header>
      <PostBody body={post.body} />
    </article>
  );
}
