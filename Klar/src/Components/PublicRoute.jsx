import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Spinner } from '../Components/ui/spinner';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 h-8 w-8" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not authenticated, show the public page
  return children;
};

export default PublicRoute;