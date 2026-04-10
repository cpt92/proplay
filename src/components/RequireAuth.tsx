import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { Role } from '../lib/types';
import PageLoader from './PageLoader';

export default function RequireAuth({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const profile = useAuthStore((s) => s.profile);
  const initialized = useAuthStore((s) => s.initialized);

  // Wait for auth initialization before redirecting
  if (!initialized) return <PageLoader />;

  if (!profile) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  if (role && profile.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}
