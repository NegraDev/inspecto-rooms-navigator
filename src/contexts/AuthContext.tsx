
import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos para o contexto de autenticação
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Valores padrão para o contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  logout: () => {},
});

// Hook para facilitar o uso do contexto
export const useAuth = () => useContext(AuthContext);

// Usuários de demonstração (em uma aplicação real, seriam verificados no backend)
const DEMO_USERS: Record<string, User & { password: string }> = {
  'admin@example.com': {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  'user@example.com': {
    id: '2',
    name: 'Usuário Comum',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Verificar se existe um usuário na sessão ao carregar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário da sessão:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulando uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = DEMO_USERS[email];
        
        if (user && user.password === password) {
          // Remover a senha antes de armazenar o usuário
          const { password: _, ...userWithoutPassword } = user;
          
          // Salvar usuário no estado e no localStorage
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          
          // Em uma aplicação real, aqui seria armazenado um token JWT
          localStorage.setItem('isAdmin', user.role === 'admin' ? 'true' : 'false');
          
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
    localStorage.removeItem('isAdmin');
  };

  // Valores para o provedor de contexto
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || false,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
