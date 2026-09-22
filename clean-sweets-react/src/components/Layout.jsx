import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <>
      <header className="site-header">
        <div className="wrap site-header__bar">
          <Link className="brand" to="/">
            <img className="brand__mark" src="/images/logo.jpg" alt="Clean Sweets" />
            <span className="brand__name">clean sweets</span>
          </Link>
          <button
            className="nav-toggle"
            aria-label="פתח תפריט"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          >
            &#9776;
          </button>
          <nav className={`nav${navOpen ? ' open' : ''}`} id="nav">
            <NavLink to="/" end>בית</NavLink>
            <NavLink to="/portfolio">עליי</NavLink>
            <NavLink to="/blog">מתכונים</NavLink>
            <NavLink to="/articles">כתבות</NavLink>
            <NavLink to="/categories">קטגוריות</NavLink>
            <NavLink to="/search">חיפוש</NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-links">
            <Link to="/terms">תנאי שימוש</Link>
            <Link to="/contact">צור קשר</Link>
            <Link to="/privacy">מדיניות פרטיות</Link>
          </div>
          <p className="copy">כל הזכויות שמורות לניקה בליאק 2026</p>
        </div>
      </footer>
    </>
  );
}
