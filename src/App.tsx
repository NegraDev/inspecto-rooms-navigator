
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { UserPermission } from "./types";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RoomListPage from "./pages/RoomListPage";
import MapPage from "./pages/MapPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import CameraPage from "./pages/CameraPage";
import ReportsPage from "./pages/ReportsPage";
import InspectionsPage from "./pages/InspectionsPage";
import ImportPage from "./pages/ImportPage";
import UsersPage from "./pages/UsersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota pública */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas protegidas que requerem autenticação */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/rooms" element={
              <ProtectedRoute>
                <RoomListPage />
              </ProtectedRoute>
            } />
            <Route path="/rooms/:id" element={
              <ProtectedRoute>
                <RoomDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            } />
            <Route path="/camera" element={
              <ProtectedRoute 
                requiredPermissions={[UserPermission.MANAGE_INSPECTIONS]}
              >
                <CameraPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute 
                requiredPermissions={[UserPermission.VIEW_REPORTS]}
              >
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/inspections" element={
              <ProtectedRoute 
                requiredPermissions={[UserPermission.VIEW_INSPECTIONS]}
              >
                <InspectionsPage />
              </ProtectedRoute>
            } />
            
            {/* Rotas que requerem privilégios de administrador */}
            <Route path="/import" element={
              <ProtectedRoute 
                requiredPermissions={[UserPermission.SYSTEM_SETTINGS, UserPermission.MANAGE_EQUIPMENT]}
              >
                <ImportPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute
                requiredPermissions={[UserPermission.SYSTEM_SETTINGS]}
              >
                <div>Página de Configurações</div>
              </ProtectedRoute>
            } />
            
            {/* Nova rota para gerenciar usuários - Somente Admin */}
            <Route path="/users" element={
              <ProtectedRoute
                requiredPermissions={[UserPermission.VIEW_USERS]}
              >
                <UsersPage />
              </ProtectedRoute>
            } />
            
            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
