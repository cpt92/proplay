import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, type Role } from '../store/useAuthStore';

export default function RequireAuth({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const user = useAuthStore((s) => (s.currentUserId ? s.users.find((u) => u.id === s.currentUserId) ?? null : null));
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}
