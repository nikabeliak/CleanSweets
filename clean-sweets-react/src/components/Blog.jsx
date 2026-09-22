import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';

export default function Blog() {
  const { posts, loading, categories } = usePosts();
  const [searchParams] = useSearchParams();
  const filterCategory = searchParams.get('cat') || '';
  const [activeCategory, setActiveCategory] = useState(filterCategory);

  useEffect(() => {
    if (filterCategory) setActiveCategory(filterCategory);
  }, [filterCategory]);

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts;

  return (
    <>
      <section className="hero wrap">
        <h1>מגוון המתכונים</h1>
      </section>

      <section className="section wrap">
        <div className="cat-filter" style={{ marginBottom: '32px' }}>
          <Link
            className={`cat-filter__btn ${!activeCategory ? 'cat-filter__btn--active' : ''}`}
            to="/blog"
            onClick={() => setActiveCategory('')}
          >
            הכל
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              className={`cat-filter__btn ${activeCategory === cat ? 'cat-filter__btn--active' : ''}`}
              to={`/blog?cat=${encodeURIComponent(cat)}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Link>
          ))}
        </div>

        {loading ? (
          <p className="center">טוען מתכונים...</p>
        ) : filtered.length === 0 ? (
          <p className="center" style={{ marginTop: '48px' }}>לא נמצאו מתכונים בקטגוריה זו.</p>
        ) : (
          <div className="grid">
            {filtered.map((p) => (
              <Link key={p.n} className="card" to={`/blog/${p.n}`}>
                <img className="card__img" loading="lazy" src={p.hero} alt={p.title} />
                <div className="card__body">
                  <h3 className="card__title">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}