import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, token } = useAuth();

    // Validar si el usuario está autenticado
    if (!isAuthenticated || !token) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;