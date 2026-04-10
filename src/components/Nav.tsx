import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa6';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuthStore } from '../store/useAuthStore';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${isActive ? 'text-white' : 'text-ink-secondary hover:text-white'}`;

export default function Nav() {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/');
  };
  const close = () => setOpen(false);

  const isAdmin = profile?.email.toLowerCase().startsWith('admin@');

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={close}>Home</NavLink>
      <NavLink to="/browse" className={linkClass} onClick={close}>Browse Athletes</NavLink>
      {profile?.role === 'athlete' && (
        <NavLink to="/athlete/dashboard" className={linkClass} onClick={close}>My Dashboard</NavLink>
      )}
      {profile?.role === 'fan' && (
        <>
          <NavLink to="/fan/bookings" className={linkClass} onClick={close}>My Bookings</NavLink>
          <NavLink to="/favorites" className={linkClass} onClick={close}>Favorites</NavLink>
        </>
      )}
      {!profile && <NavLink to="/favorites" className={linkClass} onClick={close}>Favorites</NavLink>}
      {profile && (
        <NavLink to="/messages" className={linkClass} onClick={close}>Messages</NavLink>
      )}
      {isAdmin && (
        <NavLink to="/admin" className={linkClass} onClick={close}>Admin</NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg-primary/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold" onClick={close}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-hero-gradient text-white shadow-lg shadow-accent-primary/30">
            <FaStar className="h-4 w-4" />
          </span>
          <span className="bg-hero-gradient bg-clip-text text-transparent">PlayWithAStar</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{links}</nav>

        <div className="flex items-center gap-2">
          {profile ? (
            <>
              <div className="hidden text-right text-xs sm:block">
                <div className="font-semibold text-ink-primary">{profile.name}</div>
                <div className="capitalize text-ink-muted">{profile.role}</div>
              </div>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2 text-sm">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary !px-4 !py-2 text-sm">Get started</Link>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 md:hidden"
          >
            {open ? <HiOutlineX className="h-5 w-5" /> : <HiOutlineMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/5 bg-bg-primary px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">{links}</div>
        </nav>
      )}
    </header>
  );
}
