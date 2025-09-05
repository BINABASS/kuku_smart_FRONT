import { Box, useColorModeValue } from '@chakra-ui/react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, type UserRole } from './context/AuthContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import NotFound from './pages/NotFound';
import Home from './pages/Home.tsx';

// This component is used to wrap protected routes
const ProtectedLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// This component is used to wrap public routes
const PublicLayout = () => {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box as="main">
        <Outlet />
      </Box>
    </Box>
  );
};

// Protected route component that checks authentication and role
const ProtectedRoute = ({ 
  allowedRoles,
  children 
}: { 
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        Loading...
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === 'admin' ? '/admin' : '/farmer';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Public route wrapper
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        Loading...
      </Box>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Main app component
function App() {
  const bg = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Box minH="100vh" bg={bg}>
      <Routes>
        {/* Public routes */}
        <Route element={
          <PublicRoute>
            <PublicLayout />
          </PublicRoute>
        }>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Protected routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin', 'farmer']}>
            <ProtectedLayout />
          </ProtectedRoute>
        }>
          <Route 
            path="dashboard" 
            element={<DashboardRedirect />}
          />
          
          <Route 
            path="admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="farmer" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;

// Helper component to redirect to dashboard based on current user role
const DashboardRedirect = () => {
  const { user } = useAuth();
  const role = user?.role;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/farmer" replace />;
};
