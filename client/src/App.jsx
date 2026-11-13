import Navbar from './components/Navbar';
import OfflineBanner from './components/OfflineBanner';
import { useAuth } from './context/AuthContext';
import { Redirect, useRoute } from './lib/router';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Book from './pages/Book';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import Services from './pages/Services';

// Wraps pages that need a logged-in user (and optionally an admin).
function Guard({ adminOnly = false, children }) {
  const { user, isAdmin, loading } = useAuth();
  const { pathname } = useRoute();

  if (loading) return <p className="muted">Loading…</p>;
  if (!user) return <Redirect to={`/login?from=${encodeURIComponent(pathname)}`} />;
  if (adminOnly && !isAdmin) return <Redirect to="/" />;
  return children;
}

function Page() {
  const { pathname } = useRoute();

  if (pathname === '/') return <Home />;
  if (pathname === '/services') return <Services />;
  if (pathname === '/login') return <Auth mode="login" />;
  if (pathname === '/register') return <Auth mode="register" />;
  if (pathname === '/my-bookings') {
    return (
      <Guard>
        <MyBookings />
      </Guard>
    );
  }
  if (pathname === '/admin') {
    return (
      <Guard adminOnly>
        <Admin />
      </Guard>
    );
  }
  if (pathname.startsWith('/book/')) {
    return (
      <Guard>
        <Book serviceId={pathname.split('/')[2]} />
      </Guard>
    );
  }
  return <Redirect to="/" />;
}

export default function App() {
  return (
    <>
      <OfflineBanner />
      <Navbar />
      <main className="container">
        <Page />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} Salon7 · Open daily 9 AM – 9 PM
      </footer>
    </>
  );
}
