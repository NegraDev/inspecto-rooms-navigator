
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Páginas
import Index from './pages/Index';
import MapPage from './pages/MapPage';
import InspectionsPage from './pages/InspectionsPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import RoomDetailPage from './pages/RoomDetailPage';
import RoomListPage from './pages/RoomListPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import NotFound from './pages/NotFound';
import CameraPage from './pages/CameraPage';
import ImportPage from './pages/ImportPage';

// Componentes
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Criação do cliente de Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

const ScrollToTop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/map" element={
                <ProtectedRoute>
                  <MapPage />
                </ProtectedRoute>
              } />
              <Route path="/inspections" element={
                <ProtectedRoute>
                  <InspectionsPage />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              } />
              <Route path="/room/:id" element={
                <ProtectedRoute>
                  <RoomDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/rooms" element={
                <ProtectedRoute>
                  <RoomListPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="/camera" element={
                <ProtectedRoute>
                  <CameraPage />
                </ProtectedRoute>
              } />
              <Route path="/import" element={
                <ProtectedRoute>
                  <ImportPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ScrollToTop>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
