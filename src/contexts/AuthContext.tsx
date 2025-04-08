
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserPermission, RolePermissions } from '@/types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  petrobrasKey: string; // Now required for all users
  permissions: UserPermission[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  isInspector: boolean;
  hasPermission: (permission: UserPermission) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
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
    role: 'admin',
    petrobrasKey: 'A12B',
  },
  'supervisor@example.com': {
    id: '2',
    name: 'Carlos Supervisor',
    email: 'supervisor@example.com',
    password: 'super123',
    role: 'supervisor',
    petrobrasKey: 'S34C',
  },
  'inspector@example.com': {
    id: '3',
    name: 'Maria Inspetora',
    email: 'inspector@example.com',
    password: 'insp123',
    role: 'inspector',
    petrobrasKey: '78D9',
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Verificar se existe um usuário na sessão ao carregar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Adicionar permissões baseadas na função do usuário
        if (parsedUser && parsedUser.role) {
          parsedUser.permissions = RolePermissions[parsedUser.role as UserRole] || [];
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

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulando uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const demoUser = DEMO_USERS[email];
        
        if (demoUser && demoUser.password === password) {
          // Adicionar permissões baseadas na função
          const permissions = RolePermissions[demoUser.role];
          
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
    isAdmin: user?.role === 'admin' || false,
    isSupervisor: user?.role === 'supervisor' || false,
    isInspector: user?.role === 'inspector' || false,
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
