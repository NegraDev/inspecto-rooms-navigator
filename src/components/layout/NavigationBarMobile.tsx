
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, CheckSquare, BarChart2, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavigationBarMobile: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-1 z-50">
      <div className="flex justify-around items-center">
        <MobileNavItem to="/" icon={<Home size={20} />} label="Início" />
        <MobileNavItem to="/map" icon={<MapPin size={20} />} label="Mapa" />
        <MobileNavItem to="/inspections" icon={<CheckSquare size={20} />} label="Inspeções" />
        <MobileNavItem to="/reports" icon={<BarChart2 size={20} />} label="Relatórios" />
        <MobileNavItem to="/settings" icon={<Settings size={20} />} label="Config" />
      </div>
    </nav>
  );
};

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        cn(
          "flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors",
          isActive 
            ? "text-primary" 
            : "text-gray-500 hover:text-primary"
        )
      }
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </NavLink>
  );
};
