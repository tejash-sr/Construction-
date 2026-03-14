import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute = ({ children }: UserRouteProps) => {
  const { user } = useAuth();

  // Redirect admins to admin panel
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default UserRoute;
