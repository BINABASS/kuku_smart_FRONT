import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider, useDispatch } from 'react-redux';
import { store, persistor } from './store';
import { Box, Typography } from '@mui/material';
import { PersistGate } from 'redux-persist/integration/react';
import { setUser, setToken } from './store/authSlice';
import { useEffect } from 'react';

// Layout and Pages
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import Payments from './pages/Payments';
import UserProfile from './pages/UserProfile';
import TestIntegration from './components/TestIntegration';

// Debug script - only load in development
if (process.env.NODE_ENV === 'development') {
    import('./utils/debugApi');
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('App Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                        Something went wrong!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Please check the console for more details.
                    </Typography>
                </Box>
            );
        }

        return this.props.children;
    }
}

// Main App Content
function AppContent() {
    return (
        <ThemeProvider theme={theme}>
            <div>
                <CssBaseline />
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/test" element={<TestIntegration />} />

                    {/* Protected routes */}
                    <Route path="/dashboard/*" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager']}>
                            <AppLayout />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager']}>
                            <UserProfile />
                        </ProtectedRoute>
                    } />
                    <Route path="/payments" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager']}>
                            <Payments />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </ThemeProvider>
    );
}

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            dispatch(setUser(JSON.parse(user)));
            dispatch(setToken(token));
        }
    }, [dispatch]);
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                <AppContent />
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    );
}

export default App;
