import { Moon, PenSquare, Sun, Menu, X, LogOut, User as UserIcon, Home, LayoutDashboard, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <header className="topbar">
        <Link className="brand" to="/" onClick={close}>
          <span className="brand-icon">✍️</span> BlogFlow
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links desktop-nav">
          <NavLink to="/" end>Home</NavLink>
          {user?.role === 'ADMIN' && <NavLink to="/admin">Admin</NavLink>}
          {isAuthenticated ? (
            <>
              <NavLink to="/profile"><UserIcon size={15} /> Profile</NavLink>
              <NavLink to="/blogs/new" className="nav-write-btn"><PenSquare size={15} /> Write</NavLink>
              <button className="nav-logout" onClick={logout}><LogOut size={15} /> Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="nav-register-btn">Register</NavLink>
            </>
          )}
          <button className="theme-toggle" onClick={() => setDark(v => !v)} aria-label="Toggle theme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </nav>

        {/* Mobile right controls */}
        <div className="topbar-right-mobile">
          <button className="theme-toggle" onClick={() => setDark(v => !v)} aria-label="Toggle theme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileOpen(v => !v)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div className={`drawer-overlay ${mobileOpen ? 'visible' : ''}`} onClick={close} />

      {/* Mobile Drawer */}
      <aside className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <Link className="brand" to="/" onClick={close}>
            <span className="brand-icon">✍️</span> BlogFlow
          </Link>
          <button className="drawer-close" onClick={close} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        {/* User info if logged in */}
        {isAuthenticated && (
          <div className="drawer-user">
            <div className="drawer-user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="drawer-user-name">{user?.name}</div>
              <div className="drawer-user-role">{user?.role}</div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="drawer-nav">
          <NavLink to="/" end onClick={close} className={({isActive}) => isActive ? 'drawer-link active' : 'drawer-link'}>
            <Home size={18} /> Home
          </NavLink>

          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" onClick={close} className={({isActive}) => isActive ? 'drawer-link active' : 'drawer-link'}>
              <Shield size={18} /> Admin Dashboard
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              <NavLink to="/profile" onClick={close} className={({isActive}) => isActive ? 'drawer-link active' : 'drawer-link'}>
                <UserIcon size={18} /> Profile
              </NavLink>
              <NavLink to="/blogs/new" onClick={close} className="drawer-link drawer-write">
                <PenSquare size={18} /> Write a Post
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close} className={({isActive}) => isActive ? 'drawer-link active' : 'drawer-link'}>
                <UserIcon size={18} /> Login
              </NavLink>
              <NavLink to="/register" onClick={close} className={({isActive}) => isActive ? 'drawer-link active' : 'drawer-link'}>
                <LayoutDashboard size={18} /> Register
              </NavLink>
            </>
          )}
        </nav>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          {isAuthenticated && (
            <button className="drawer-logout" onClick={() => { logout(); close(); }}>
              <LogOut size={17} /> Logout
            </button>
          )}
          <button className="drawer-theme" onClick={() => setDark(v => !v)}>
            {dark ? <><Sun size={17} /> Light Mode</> : <><Moon size={17} /> Dark Mode</>}
          </button>
        </div>
      </aside>

      <main className="shell">
        <Outlet />
      </main>
    </>
  );
}
