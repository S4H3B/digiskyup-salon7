import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, navigate, useRoute } from '../lib/router';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { pathname } = useRoute();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const cls = (path) => (pathname === path ? 'active' : '');

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>
          SALON7
        </Link>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <Link to="/services" className={cls('/services')} onClick={close}>
            Services
          </Link>
          {user && (
            <Link to="/my-bookings" className={cls('/my-bookings')} onClick={close}>
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={cls('/admin')} onClick={close}>
              Admin
            </Link>
          )}
          {user ? (
            <>
              <span className="muted small">{user.name}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={cls('/login')} onClick={close}>
                Log in
              </Link>
              <Link to="/register" className="btn" onClick={close}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
