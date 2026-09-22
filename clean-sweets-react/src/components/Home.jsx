import { Link } from 'react-router-dom';
import { usePosts, useArticles } from '../hooks/usePosts';

export default function Home() {
  const { posts } = usePosts();
  const articles = useArticles();

  const latestRecipes = posts.slice(0, 6);
  const featuredArticles = articles.slice(0, 6);

  return (
    <>
      <section className="hero wrap">
        <h1 className="hero__title">ברוכים הבאים</h1>
        <p className="hero__sub">clean sweets</p>
        <p>קינוחים בריאים מהירים ופשוטים שמתאימים לכולם. כל הקינוחים ללא גלוטן וללא סוכר.</p>
      </section>

      <section className="wrap">
        <div className="promo">
          <h2>קוד מועדון לניצת הדובדבן</h2>
          <div className="code">600161</div>
          <p>5%% הנחה על כל המוצרים &middot; כולל כפל מבצעים</p>
          <p>הקוד תקף לכולם וניתן למימוש בכל סניפי ניצת הדובדבן ובאונליין.</p>
          <p>כל מה שעליכם לעשות זה לתת את קוד המועדון בקופה בסיום הרכישה או להקליד אותו בהערות להזמנה בהזמנות באונליין.</p>
          <Link className="btn" to="/promo">פרטים נוספים</Link>
        </div>
      </section>

      <section className="section wrap">
        <h2 className="center">המתכונים האחרונים שלנו</h2>
        <div className="grid">
          {latestRecipes.map((p) => (
            <Link key={p.n} className="card" to={`/blog/${p.n}`}>
              <img className="card__img" loading="lazy" src={p.hero} alt={p.title} />
              <div className="card__body">
                <h3 className="card__title">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <p className="center" style={{ marginTop: '32px' }}>
          <Link className="btn btn--solid" to="/blog">מתכונים נוספים</Link>
        </p>
      </section>

      <section className="section wrap">
        <div className="split">
          <div>
            <h2>עליי בקצרה</h2>
            <p>
              היי, אני ניקה אבל לרוב קוראים לי ניקס. את הדרך שלי לבריאות גיליתי כבר בגיל 13,
              כשלמדתי שתזונה היא לא רק קלוריות , אלא חיבור בין גוף ונפש.
              מאהבה למתוקים התחלתי ליצור קינוחים בריאים וטעימים ללא קמח או סוכר.
              היום אני משתפת באהבה מתכונים שמוכיחים שאפשר לאכול קינוחים בריאים ויפים
              מבלי לוותר על ההנאה.
            </p>
            <p><Link className="btn btn--ghost" to="/portfolio">קרא עוד</Link></p>
          </div>
          <img loading="lazy" src="/images/49aa8c_04addcbbed5d4efc95b73bb4d240922a_mv2.jpg" alt="הסיפור שלי" />
        </div>
      </section>

      <section className="section wrap">
        <h2>פוסטים נוספים</h2>
        <div className="grid">
          {featuredArticles.map((a) => (
            <Link key={a.id} className="card" to={`/articles/${a.id}`}>
              <img className="card__img" loading="lazy" src={a.image} alt={a.title} />
              <div className="card__body">
                <h3 className="card__title">{a.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}