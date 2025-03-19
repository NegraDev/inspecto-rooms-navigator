
import { ReactNode } from 'react';
import { Header } from './Header';
import { NavigationBar } from './NavigationBar';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex flex-1">
        <aside className="hidden md:block w-56 border-r border-gray-100 p-4">
          <NavigationBar />
        </aside>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
