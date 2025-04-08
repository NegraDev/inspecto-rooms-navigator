
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserPermission } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSupervisor?: boolean;
  requiredPermissions?: UserPermission[];
  testMode?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireSupervisor = false,
  requiredPermissions = [],
  testMode = false,
}) => {
  const { isAuthenticated, isAdmin, isSupervisor, hasPermission, user } = useAuth();
  const location = useLocation();

  // Detecção de modo de teste para debugging
  React.useEffect(() => {
    if (testMode) {
      console.log('Autenticação:', {
        isAuthenticated,
        isAdmin,
        isSupervisor,
        user,
        requiredPermissions,
        hasAllPermissions: requiredPermissions.every(p => hasPermission(p))
      });
    }
  }, [isAuthenticated, isAdmin, isSupervisor, user, requiredPermissions, hasPermission, testMode]);

  // Se não estiver autenticado, redirecionar para a página de login
  if (!isAuthenticated) {
    if (testMode) {
      toast({
        title: "Acesso Negado",
        description: "Usuário não autenticado. Redirecionando para login.",
        variant: "destructive",
      });
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota requer privilégios de administrador e o usuário não for admin
  if (requireAdmin && !isAdmin) {
    if (testMode) {
      toast({
        title: "Acesso Negado",
        description: "Esta página requer privilégios de administrador.",
        variant: "destructive",
      });
    }
    // Redirecionar para a página inicial
    return <Navigate to="/" replace />;
  }

  // Se a rota requer privilégios de supervisor e o usuário não for supervisor nem admin
  if (requireSupervisor && !isSupervisor && !isAdmin) {
    if (testMode) {
      toast({
        title: "Acesso Negado",
        description: "Esta página requer privilégios de supervisor.",
        variant: "destructive",
      });
    }
    // Redirecionar para a página inicial
    return <Navigate to="/" replace />;
  }

  // Verificar permissões específicas
  if (requiredPermissions.length > 0) {
    const hasAllRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllRequiredPermissions) {
      if (testMode) {
        toast({
          title: "Acesso Negado",
          description: "Você não possui todas as permissões necessárias.",
          variant: "destructive",
        });
      }
      return <Navigate to="/" replace />;
    }
  }

  // Se passar pelas verificações, renderizar o conteúdo protegido
  return <>{children}</>;
};
