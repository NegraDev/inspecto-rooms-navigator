
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserPermission } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSupervisor?: boolean;
  requiredPermissions?: UserPermission[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireSupervisor = false,
  requiredPermissions = []
}) => {
  const { isAuthenticated, isAdmin, isSupervisor, hasPermission } = useAuth();
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
  if (requireSupervisor && !isSupervisor && !isAdmin) {
    // Redirecionar para a página inicial
    return <Navigate to="/" replace />;
  }

  // Verificar permissões específicas
  if (requiredPermissions.length > 0) {
    const hasAllRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllRequiredPermissions) {
      return <Navigate to="/" replace />;
    }
  }

  // Se passar pelas verificações, renderizar o conteúdo protegido
  return <>{children}</>;
};
