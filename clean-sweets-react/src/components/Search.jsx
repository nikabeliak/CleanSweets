import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles, usePosts } from '../hooks/usePosts';
import { useTitle } from '../utils';

export default function Search() {
  const { posts, loading } = usePosts();
  const articles = useArticles();
  const [query, setQuery] = useState('');
  useTitle('חיפוש');

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const postHits = posts
      .filter((p) => p.title.includes(q))
      .map((p) => ({ title: p.title, to: `/blog/${p.n}` }));
    const articleHits = articles
      .filter((a) => a.title.includes(q) || (a.excerpt || '').includes(q))
      .map((a) => ({ title: a.title, to: `/articles/${a.id}` }));
    return [...postHits, ...articleHits];
  }, [query, posts, articles]);

  return (
    <>
      <section className="hero wrap">
        <h1>חיפוש</h1>
        <input
          className="search-input"
          placeholder="חפשו מתכון או כתבה..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </section>
      <section className="section wrap" style={{ maxWidth: 760 }}>
        {loading && query.trim() ? (
          <p>טוען...</p>
        ) : !query.trim() ? null : results.length === 0 ? (
          <p>לא נמצאו תוצאות עבור: {query.trim()}</p>
        ) : (
          results.map((r) => (
            <div key={r.to} className="result">
              <h3>
                <Link to={r.to}>{r.title}</Link>
              </h3>
            </div>
          ))
        )}
      </section>
    </>
  );
}
