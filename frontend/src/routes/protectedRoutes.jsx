import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from '../providers/authProvider.jsx';

export const ProtectedRoute = ({ children }) => {
    const { user, setUser, loading } = useAuth();

    if (loading) return <div>Loading...</div>; 
    if (!user) return <Navigate to="/auth" replace />;

    return children; 
};

export default ProtectedRoute;
