import { Box, useColorModeValue } from '@chakra-ui/react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, type UserRole } from './context/AuthContext';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import NotFound from './pages/NotFound';
import Home from './pages/Home.tsx';
import UserManagement from './pages/admin/UserManagement';
import FarmerManagement from './pages/admin/FarmerManagement';
import FarmManagement from './pages/admin/FarmManagement';
import DeviceManagement from './pages/admin/DeviceManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';

// This component is used to wrap protected routes
const ProtectedLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// This component is used to wrap admin routes
const AdminProtectedLayout = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
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
        
        {/* Protected routes - App layout for generic protected pages */}
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
            path="farmer" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Admin routes - use AdminLayout only to avoid duplicate headers */}
        <Route 
          path="admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProtectedLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="farmers" element={<FarmerManagement />} />
          <Route path="farms" element={<FarmManagement />} />
          <Route path="devices" element={<DeviceManagement />} />
          <Route path="breed-types" element={<div>Breed Types Management</div>} />
          <Route path="breeds" element={<div>Breeds Management</div>} />
          <Route path="activity-types" element={<div>Activity Types Management</div>} />
          <Route path="condition-types" element={<div>Condition Types Management</div>} />
          <Route path="food-types" element={<div>Food Types Management</div>} />
          <Route path="sensor-types" element={<div>Sensor Types Management</div>} />
          <Route path="batches" element={<div>Batches Management</div>} />
          <Route path="activities" element={<div>Activities Management</div>} />
          <Route path="readings" element={<div>Readings Management</div>} />
          <Route path="subscriptions" element={<SubscriptionManagement />} />
          <Route path="subscription-types" element={<div>Subscription Types Management</div>} />
          <Route path="resources" element={<div>Resources Management</div>} />
          <Route path="payments" element={<div>Payments Management</div>} />
          <Route path="health-conditions" element={<div>Health Conditions Management</div>} />
          <Route path="recommendations" element={<div>Recommendations Management</div>} />
          <Route path="disease-exceptions" element={<div>Disease Exceptions Management</div>} />
          <Route path="anomalies" element={<div>Anomalies Management</div>} />
          <Route path="medications" element={<div>Medications Management</div>} />
          <Route path="django-admin" element={<div>Django Admin</div>} />
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
