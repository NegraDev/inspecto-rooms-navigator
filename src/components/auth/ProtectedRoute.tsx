
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Se não estiver autenticado, redirecionar para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota requer privilégios de administrador e o usuário não for admin
  if (requireAdmin && !isAdmin) {
    // Redirecionar para a página inicial
    return <Navigate to="/" replace />;
  }

  // Se passar pelas verificações, renderizar o conteúdo protegido
  return <>{children}</>;
};
