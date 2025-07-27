import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    
    console.log('ProtectedRoute - user:', user);
    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
    console.log('ProtectedRoute - allowedRoles:', allowedRoles);

    if (!user) {
        console.log('ProtectedRoute - No user, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('ProtectedRoute - User role not allowed, redirecting to home');
        return <Navigate to="/" replace />;
    }

    console.log('ProtectedRoute - User authenticated, rendering children');
    return children;
}
