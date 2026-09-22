import { Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="wrap site-header__bar">
          <a className="brand" href="/">
            <img className="brand__mark" src="/images/logo.jpg" alt="Clean Sweets" />
            <span className="brand__name">clean sweets</span>
          </a>
          <button
            className="nav-toggle"
            aria-label="פתח תפריט"
            onClick={() => document.getElementById('nav').classList.toggle('open')}
          >
            &#9776;
          </button>
          <nav className="nav" id="nav">
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
            <a href="/terms">תנאי שימוש</a>
            <a href="/contact">צור קשר</a>
            <a href="/privacy">מדיניות פרטיות</a>
          </div>
          <p className="copy">כל הזכויות שמורות לניקה בליאק 2026</p>
        </div>
      </footer>
    </>
  );
}