// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/acceso" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/panel-principal" replace />;
  }
  
  return children;
};

export default ProtectedRoute;