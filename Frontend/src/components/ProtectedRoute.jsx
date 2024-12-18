import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Redirect to login if there's no token
        return <Navigate to="/login" replace />;
    }
    
    // Render children if authenticated
    return children;
};

export default ProtectedRoute;
