
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserPermission, RolePermissionMap } from '@/types';
import { useApiConfig } from '@/hooks/useApiConfig';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  petrobrasKey: string;
  permissions: UserPermission[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  isInspector: boolean;
  hasPermission: (permission: UserPermission) => boolean;
  login: (emailOrKey: string, password: string, isUsingKey?: boolean) => Promise<boolean>;
  logout: () => void;
}

// Valores padrão para o contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isSupervisor: false,
  isInspector: false,
  hasPermission: () => false,
  login: async () => false,
  logout: () => {},
});

// Hook para facilitar o uso do contexto
export const useAuth = () => useContext(AuthContext);

// Usuários de demonstração (em uma aplicação real, seriam verificados no backend)
const DEMO_USERS: Record<string, { id: string; name: string; email: string; password: string; role: UserRole; petrobrasKey: string }> = {
  'admin@example.com': {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    petrobrasKey: 'A12B',
  },
  'supervisor@example.com': {
    id: '2',
    name: 'Carlos Supervisor',
    email: 'supervisor@example.com',
    password: 'super123',
    role: UserRole.SUPERVISOR,
    petrobrasKey: 'S34C',
  },
  'inspector@example.com': {
    id: '3',
    name: 'Maria Inspetora',
    email: 'inspector@example.com',
    password: 'insp123',
    role: UserRole.INSPECTOR,
    petrobrasKey: '78D9',
  }
};

// Índice adicional para buscar usuários pela chave Petrobras
const PETROBRAS_KEY_INDEX: Record<string, string> = {
  'A12B': 'admin@example.com',
  'S34C': 'supervisor@example.com',
  '78D9': 'inspector@example.com'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { mode } = useApiConfig();
  
  // Verificar se existe um usuário na sessão ao carregar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Adicionar permissões baseadas na função do usuário
        if (parsedUser && parsedUser.role) {
          parsedUser.permissions = RolePermissionMap[parsedUser.role as UserRole] || [];
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário da sessão:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission: UserPermission): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Função de login adaptada para suportar login por email ou chave Petrobras
  const login = async (emailOrKey: string, password: string, isUsingKey: boolean = false): Promise<boolean> => {
    console.log(`Tentando login com ${isUsingKey ? 'chave Petrobras' : 'email'}: ${emailOrKey} em modo ${mode}`);

    // Se estivermos no modo AWS, tentar autenticar com AWS Cognito
    if (mode === 'aws') {
      try {
        // Aqui seria implementada a lógica de autenticação real com AWS Cognito
        // Por enquanto, vamos simular usando os usuários de demonstração
        console.log('Simulando autenticação AWS para testes');
        return simulateLogin(emailOrKey, password, isUsingKey);
      } catch (error) {
        console.error("Erro na autenticação AWS:", error);
        return false;
      }
    } else {
      // Modo local, usar autenticação simulada
      return simulateLogin(emailOrKey, password, isUsingKey);
    }
  };

  // Função que simula o login para testes
  const simulateLogin = (emailOrKey: string, password: string, isUsingKey: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Determina o email do usuário com base no método de login
        let userEmail = emailOrKey;
        
        // Se estiver usando a chave Petrobras, busca o email correspondente
        if (isUsingKey) {
          userEmail = PETROBRAS_KEY_INDEX[emailOrKey];
          // Se não encontrar a chave, falha o login
          if (!userEmail) {
            resolve(false);
            return;
          }
        }
        
        const demoUser = DEMO_USERS[userEmail];
        
        if (demoUser && demoUser.password === password) {
          // Adicionar permissões baseadas na função
          const permissions = RolePermissionMap[demoUser.role];
          
          // Criar usuário completo com permissões
          const userWithPermissions: User = {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
            petrobrasKey: demoUser.petrobrasKey,
            permissions
          };
          
          // Salvar usuário no estado e no localStorage
          setUser(userWithPermissions);
          localStorage.setItem('user', JSON.stringify(userWithPermissions));
          
          // Em uma aplicação real, aqui seria armazenado um token JWT
          localStorage.setItem('userRole', demoUser.role);
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800); // Simular um pequeno atraso de rede
    });
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  // Valores para o provedor de contexto
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN || false,
    isSupervisor: user?.role === UserRole.SUPERVISOR || false,
    isInspector: user?.role === UserRole.INSPECTOR || false,
    hasPermission,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
