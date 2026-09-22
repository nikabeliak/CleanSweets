import { Link, useParams } from 'react-router-dom';
import { useArticles } from '../hooks/usePosts';
import { assetUrl, useTitle } from '../utils';
import PostBody from './PostBody';

export default function Article() {
  const { articleId } = useParams();
  const articles = useArticles();
  const article = articles.find((a) => a.id === articleId || a.slug === articleId);

  useTitle(article?.title || 'כתבה לא נמצאה');

  if (!article) {
    return (
      <section className="hero wrap">
        <h1>הכתבה לא נמצאה</h1>
        <p><Link className="back-link" to="/articles">← חזרה לכתבות</Link></p>
      </section>
    );
  }

  return (
    <article className="post">
      <header className="post__header wrap">
        <Link className="back-link" to="/articles">← חזרה לכתבות</Link>
        <h1>{article.title}</h1>
        {article.category && (
          <div className="post__meta">
            <span>{article.category}</span>
          </div>
        )}
      </header>
      {article.image && (
        <div className="post__hero wrap">
          <img loading="lazy" src={assetUrl(article.image)} alt={article.title} />
        </div>
      )}
      <PostBody body={article.body} />
    </article>
  );
}
