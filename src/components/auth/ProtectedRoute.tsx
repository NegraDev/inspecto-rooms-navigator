
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSupervisor?: boolean;
  allowInspector?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireSupervisor = false,
  allowInspector = true
}) => {
  const { isAuthenticated, isAdmin, isSupervisor, isInspector } = useAuth();
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

  // Se a rota requer privilégios de supervisor e o usuário não for supervisor nem admin
  if (requireSupervisor && !isSupervisor) {
    // Redirecionar para a página inicial
    return <Navigate to="/" replace />;
  }

  // Se a rota não permite inspetores e o usuário é apenas inspetor
  if (!allowInspector && isInspector && !isSupervisor) {
    return <Navigate to="/" replace />;
  }

  // Se passar pelas verificações, renderizar o conteúdo protegido
  return <>{children}</>;
};
