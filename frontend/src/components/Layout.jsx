import { Moon, PenSquare, Sun, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => { setMobileOpen(false); }, [isAuthenticated]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <header className="topbar">
        <Link className="brand" to="/" onClick={close}>
          <span className="brand-icon">✍️</span> BlogFlow
        </Link>

        <nav className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>

          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" onClick={close}>Admin</NavLink>
          )}

          {isAuthenticated ? (
            <>
              <NavLink to="/profile" onClick={close}>
                <UserIcon size={15} /> Profile
              </NavLink>
              <NavLink to="/blogs/new" className="nav-write-btn" onClick={close}>
                <PenSquare size={15} /> Write
              </NavLink>
              <button className="nav-logout" onClick={() => { logout(); close(); }}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Login</NavLink>
              <NavLink to="/register" className="nav-register-btn" onClick={close}>Register</NavLink>
            </>
          )}

          <button className="theme-toggle" onClick={() => setDark((v) => !v)} aria-label="Toggle theme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </nav>

        <div className="topbar-right-mobile">
          <button className="theme-toggle" onClick={() => setDark((v) => !v)} aria-label="Toggle theme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileOpen && <div className="nav-overlay" onClick={close} />}

      <main className="shell">
        <Outlet />
      </main>
    </>
  );
}
