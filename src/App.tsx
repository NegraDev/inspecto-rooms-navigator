
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RoomListPage from "./pages/RoomListPage";
import MapPage from "./pages/MapPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import CameraPage from "./pages/CameraPage";
import ReportsPage from "./pages/ReportsPage";
import InspectionsPage from "./pages/InspectionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<RoomListPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/inspections" element={<InspectionsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
