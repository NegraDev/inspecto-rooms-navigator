
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Grid3X3, 
  Map, 
  Camera, 
  FileText, 
  Settings, 
  CheckSquare,
  LayoutDashboard,
  FileInput
} from 'lucide-react';

type NavItem = {
  label: string;
  icon: React.ElementType;
  href: string;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Salas", icon: Grid3X3, href: "/rooms" },
  { label: "Mapa", icon: Map, href: "/map" },
  { label: "Câmera", icon: Camera, href: "/camera" },
  { label: "Inspeções", icon: CheckSquare, href: "/inspections" },
  { label: "Relatórios", icon: FileText, href: "/reports" },
  { label: "Importar", icon: FileInput, href: "/import", adminOnly: true },
  { label: "Configurações", icon: Settings, href: "/settings" },
];

export const NavigationBar: React.FC = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Verificar se o usuário é um administrador ao carregar o componente
  useEffect(() => {
    // Em um sistema real, isso viria de um sistema de autenticação
    // Por enquanto, vamos usar localStorage para demonstração
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
    };
    
    checkAdminStatus();
    
    // Se ainda não houver status de admin definido, definimos como falso por padrão
    if (localStorage.getItem('isAdmin') === null) {
      localStorage.setItem('isAdmin', 'false');
    }
  }, []);
  
  return (
    <nav className="w-full md:w-56 flex flex-col">
      <div className="space-y-1 py-2">
        {navItems
          .filter(item => !item.adminOnly || isAdmin)
          .map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon 
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  )} 
                />
                {item.label}
                
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                )}
              </Link>
            );
          })}
      </div>
    </nav>
  );
};
