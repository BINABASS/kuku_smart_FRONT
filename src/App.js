import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

// Layout and Pages
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import Payments from './pages/Payments';
import TestIntegration from './components/TestIntegration';

// Debug script
import './utils/debugApi';

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

function App() {
    const persistor = persistStore(store);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
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
                            <Route path="/payments" element={
                                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                                    <Payments />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </div>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
