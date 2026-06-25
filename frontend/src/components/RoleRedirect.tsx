import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roleDashboardPaths } from '../utils/roles';

export const RoleRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={roleDashboardPaths[user.role]} replace />;
};
