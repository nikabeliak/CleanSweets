import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import ContactForm from './ContactForm';

const RECIPE_CATS = [
  { name: 'דל בקלוריות', to: '/blog?cat=%D7%93%D7%9C%20%D7%91%D7%A7%D7%9C%D7%95%D7%A8%D7%99%D7%95%D7%AA' },
  { name: 'לסכרתיים וקטוגנים', to: '/blog?cat=%D7%9C%D7%A1%D7%9B%D7%A8%D7%AA%D7%99%D7%99%D7%9D%20%D7%95%D7%A7%D7%98%D7%95%D7%92%D7%A0%D7%99%D7%9D' },
  { name: 'עשיר בחלבון', to: '/blog?cat=%D7%A2%D7%A9%D7%99%D7%A8%20%D7%91%D7%97%D7%9C%D7%91%D7%95%D7%9F' },
  { name: 'ללא לקטוז', to: '/blog?cat=%D7%9C%D7%9C%D7%90%20%D7%9C%D7%A7%D7%98%D7%95%D7%96' },
];

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false);
    setRecipesOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <>
      {navOpen && (
        <button className="nav-backdrop" aria-label="סגור תפריט" onClick={() => setNavOpen(false)} />
      )}
      <header className="site-header">
        <div className="wrap site-header__bar">
          <nav className={`nav nav--start${navOpen ? ' open' : ''}`} id="nav">
            <button type="button" className="nav__close" aria-label="סגור" onClick={() => setNavOpen(false)}>
              ×
            </button>
            <NavLink to="/portfolio">עליי</NavLink>
            <div className={`nav__dropdown${recipesOpen ? ' is-open' : ''}`}>
              <NavLink to="/blog">מתכונים</NavLink>
              <button
                type="button"
                className="nav__more"
                aria-label="קטגוריות"
                aria-expanded={recipesOpen}
                onClick={() => setRecipesOpen((open) => !open)}
              >
                ▾
              </button>
              <div className="nav__menu">
                {RECIPE_CATS.map((cat) => (
                  <Link key={cat.name} to={cat.to}>{cat.name}</Link>
                ))}
              </div>
            </div>
            <NavLink to="/" end className="nav__home-mobile">בית</NavLink>
            <NavLink to="/articles" className="nav__home-mobile">כתבות</NavLink>
            <Link className="nav__search-mobile nav__home-mobile" to="/search">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16 16.5L20 20.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              חיפוש
            </Link>
          </nav>

          <Link className="brand" to="/" aria-label="clean sweets">
            <img className="brand__logo" src="/images/logo-mark.png" alt="clean sweets" />
          </Link>

          <button
            className="nav-toggle"
            aria-label="פתח תפריט"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 16" width="26" height="16" aria-hidden="true">
              <path d="M0 1h24M0 8h24M0 15h24" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>

          <nav className="nav nav--end">
            <NavLink to="/" end>בית</NavLink>
            <NavLink to="/articles">כתבות</NavLink>
            <Link className="nav__search" to="/search" aria-label="חיפוש">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16 16.5L20 20.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-hero" style={{ backgroundImage: 'url(/images/footer-coffee.jpg)' }}>
          <div className="wrap footer-hero__grid">
            <div className="footer-copy">
              <h2>החלטות קטנות שיעזרו לכם להיות קצת יותר בריאים חזקים ויפים ביום הבא</h2>
              <div className="footer-note">
                <p>אני תמיד רוצה לשמוע מה התוכן שאתם מחפשים, ומה מעניין אתכם.</p>
                <p>בריאות זה תהליך, תמיד יש מקום לגדול ולהשתפר ולכן אם יש לכם ידע שאתם יכולים לתרום זה מבורך ואני פתוחה לשמוע.</p>
              </div>
            </div>
            <div className="footer-card">
              <h2>פה כדי להקשיב לכם</h2>
              <ContactForm variant="footer" />
            </div>
          </div>
        </div>
        <div className="footer-bar">
          <p className="copy">כל הזכויות שמורות לניקה בליאק 2026</p>
          <div className="footer-links">
            <Link to="/privacy">מדניות פרטיות</Link>
            <Link to="/contact">צור קשר</Link>
            <Link to="/terms">תנאי שימוש</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
