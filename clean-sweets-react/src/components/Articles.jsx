import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/usePosts';
import { assetUrl, useTitle } from '../utils';

export default function Articles() {
  const articles = useArticles();
  useTitle('כתבות');

  return (
    <>
      <section className="hero wrap">
        <h1>המדריך לחיים פשוטים ובריאים</h1>
        <p className="hero__sub">כתבות, המלצות ותובנות יומיומיות</p>
      </section>
      <section className="section wrap">
        {articles.map((a) => (
          <Link key={a.id} className="article" to={`/articles/${a.id}`}>
            <img loading="lazy" src={assetUrl(a.image)} alt={a.title} />
            <div>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}