
import React from 'react';
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
  FileInput,
  LogOut,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPermission } from '@/types';

type NavItem = {
  label: string;
  icon: React.ElementType;
  href: string;
  requiredPermission?: UserPermission;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Salas", icon: Grid3X3, href: "/rooms" },
  { label: "Mapa", icon: Map, href: "/map" },
  { label: "Câmera", icon: Camera, href: "/camera", requiredPermission: UserPermission.MANAGE_INSPECTIONS },
  { label: "Inspeções", icon: CheckSquare, href: "/inspections", requiredPermission: UserPermission.VIEW_INSPECTIONS },
  { label: "Relatórios", icon: FileText, href: "/reports", requiredPermission: UserPermission.VIEW_REPORTS },
  { label: "Importar", icon: FileInput, href: "/import", requiredPermission: UserPermission.MANAGE_EQUIPMENT },
  { label: "Usuários", icon: Users, href: "/users", requiredPermission: UserPermission.VIEW_USERS },
  { label: "Configurações", icon: Settings, href: "/settings", requiredPermission: UserPermission.SYSTEM_SETTINGS },
];

export const NavigationBar: React.FC = () => {
  const location = useLocation();
  const { logout, hasPermission } = useAuth();
  
  return (
    <nav className="w-full md:w-56 flex flex-col">
      <div className="space-y-1 py-2">
        {navItems
          .filter(item => !item.requiredPermission || hasPermission(item.requiredPermission))
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
          
        {/* Botão de Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </nav>
  );
};
