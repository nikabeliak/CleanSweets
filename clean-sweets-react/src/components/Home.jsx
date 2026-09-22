import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/usePosts';
import { assetUrl, useTitle } from '../utils';
import { HOME_ARTICLE_IDS, HOME_RECIPES } from '../data/homeRecipes';

const SLIDES = [
  {
    title: 'צליאקים?',
    line: 'כל הקינוחים באתר מתאימים עבורכם',
    sub: 'נשאר רק לבחור איזה קינוח תרצו להכין היום',
    images: [
      '/images/49aa8c_2a07d8e69af44bd59a139d897f336281_mv2.jpg',
      '/images/49aa8c_08ca0661ca58493eae8b6d54f9c19ac4_mv2.jpg',
    ],
  },
  {
    title: 'ברוכים הבאים',
    line: 'clean sweets',
    sub: 'קינוחים בריאים מהירים ופשוטים שמתאימים לכולם\nכל הקינוחים ללא גלוטן וללא סוכר',
    images: [
      '/images/49aa8c_08ca0661ca58493eae8b6d54f9c19ac4_mv2.jpg',
      '/images/49aa8c_2a07d8e69af44bd59a139d897f336281_mv2.jpg',
    ],
  },
  {
    title: 'קינוחים עבור',
    line: 'קטוגנים סכרתיים ורגישים ללקטוז',
    sub: 'כדי שכולם יוכלו להנות מהקינוח שמוגש בארוחת שישי',
    images: ['/images/hero-coconut-b.jpg', '/images/hero-coconut-a.jpg'],
  },
  {
    title: 'קינוחים דלים בקלוריות',
    line: 'ומועשרים בחלבון',
    sub: 'כדי שתכולו לשלב כמה מתוק שתרצו בתזונה היומיומית שלכם',
    images: ['/images/hero-yogurt-a.jpg', '/images/hero-yogurt-b.jpg'],
  },
];

export default function Home() {
  const articles = useArticles();
  const railRef = useRef(null);
  const [slide, setSlide] = useState(0);
  useTitle('קינוחים בריאים');

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((n) => (n + 1) % SLIDES.length);
    }, 5200);
    return () => clearInterval(id);
  }, []);

  const current = SLIDES[slide];
  const featuredArticles = HOME_ARTICLE_IDS
    .map((id) => articles.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <>
      <section className="showcase">
        <button
          className="showcase__arrow showcase__arrow--prev"
          aria-label="הקודם"
          onClick={() => setSlide((n) => (n - 1 + SLIDES.length) % SLIDES.length)}
        >
          ‹
        </button>
        <div className={`showcase__frame${slide % 2 ? ' is-flip' : ''}`} key={slide}>
          <div className="showcase__copy">
            <h1>{current.title}</h1>
            <p className={`showcase__line${current.line === 'clean sweets' ? ' showcase__line--script' : ''}`}>{current.line}</p>
            {current.line === 'clean sweets' && <span className="showcase__rule" />}
            <p className="showcase__sub">{current.sub}</p>
            <img className="showcase__photo showcase__photo--side" src={current.images[0]} alt="" />
          </div>
          <img className="showcase__photo showcase__photo--main" src={current.images[1]} alt="" />
        </div>
        <button
          className="showcase__arrow showcase__arrow--next"
          aria-label="הבא"
          onClick={() => setSlide((n) => (n + 1) % SLIDES.length)}
        >
          ›
        </button>
        <div className="showcase__dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={i === slide ? 'is-on' : ''}
              aria-label={`שקופית ${i + 1}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </section>

      <section className="club">
        <div className="club__text">
          <h2>קוד הנחה לניצת הדובדבן</h2>
          <p>הקוד תקף לכולם וניתן למימוש בכל סניפי ניצת הדובדבן ובאונליין</p>
          <p>כל מה שעליכם לעשות זה לתת את קוד המועדון בקופה בסיום הרכישה או להקליד אותו בהערות להזמנה בהזמנות באונליין</p>
          <Link className="btn btn--line" to="/promo">פרטים נוספים</Link>
        </div>
        <div className="club__card">
          <div className="club__plate">
            <img src="/images/logo-mark.png" alt="" />
            <p>קוד מועדון:</p>
            <strong>600161</strong>
          </div>
          <div className="club__badge">
            5% הנחה על כל המוצרים
            <span>כולל כפל מבצעים</span>
          </div>
        </div>
      </section>

      <section className="section wrap recipes">
        <h2 className="center">המתכונים האחרונים שלנו</h2>
        <div className="recipe-grid">
          {HOME_RECIPES.slice(0, 8).map((p) => (
            <Link key={p.n} className="recipe" to={`/blog/${p.n}`}>
              <img loading="lazy" src={p.image} alt={p.title} />
              <span>{p.title}</span>
            </Link>
          ))}
        </div>
        <p className="center recipes__more">
          <Link className="btn btn--line btn--ink" to="/blog">מתכונים נוספים</Link>
        </p>
      </section>

      <section className="story">
        <div className="story__copy">
          <h2>עליי בקצרה</h2>
          <p>
            היי, אני ניקה אבל לרוב קוראים לי ניקס.
            את הדרך שלי לבריאות גיליתי כבר בגיל 13, כשלמדתי שתזונה היא לא רק קלוריות , אלא חיבור בין גוף ונפש.
            מאהבה למתוקים התחלתי ליצור קינוחים בריאים וטעימים ללא קמח או סוכר.
            היום אני משתפת באהבה מתכונים שמוכיחים שאפשר לאכול קינוחים בריאים ויפים מבלי לוותר על ההנאה.
          </p>
        </div>
        <Link className="story__photo" to="/portfolio">
          <img src="/images/49aa8c_04addcbbed5d4efc95b73bb4d240922a_mv2.jpg" alt="הסיפור שלי" />
          <div className="story__overlay">
            <h2>הסיפור שלי</h2>
            <span>&lt; קרא עוד</span>
          </div>
        </Link>
      </section>

      <section className="section wrap articles-rail">
        <h2 className="center">לאט ובכיף להפוך בריאות לשגרה נעימה</h2>
        <p className="center articles-rail__sub">כתבות, המלצות ותובנות יומיומיות</p>
        <div className="rail-wrap">
          <button className="rail__arrow rail__arrow--prev" aria-label="הקודם" onClick={() => railRef.current?.scrollBy({ left: 321, behavior: 'smooth' })}>‹</button>
          <div className="rail" ref={railRef}>
          {featuredArticles.map((a) => (
            <Link key={a.id} className="rail__card" to={`/articles/${a.id}`}>
              <img loading="lazy" src={assetUrl(a.image)} alt={a.title} />
              <span>{a.title}</span>
            </Link>
          ))}
          </div>
          <button className="rail__arrow rail__arrow--next" aria-label="הבא" onClick={() => railRef.current?.scrollBy({ left: -321, behavior: 'smooth' })}>›</button>
        </div>
      </section>
    </>
  );
}
