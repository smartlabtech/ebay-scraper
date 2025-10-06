import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Center, Loader } from '@mantine/core';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" variant="bars" color="violet" />
      </Center>
    );
  }

  // Check if user is authenticated and has admin role
  if (!user || user.role !== 'admin') {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;