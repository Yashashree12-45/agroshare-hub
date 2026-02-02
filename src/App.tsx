import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookingHistory from "./pages/BookingHistory";
import GPSTracking from "./pages/GPSTracking";
import AIRecommendation from "./pages/AIRecommendation";
import Wallet from "./pages/Wallet";
import Pricing from "./pages/Pricing";
import ListEquipment from "./pages/ListEquipment";
import Settings from "./pages/Settings";
import ChatBot from "./components/chatbot/ChatBot";
import { EmergencySupport } from "./components/support/EmergencySupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="agrotool-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Protected routes */}
            <Route path="/equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
            <Route path="/equipment/:id" element={<ProtectedRoute><EquipmentDetail /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/owner-dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/operator-dashboard" element={<ProtectedRoute><OperatorDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
            <Route path="/tracking" element={<ProtectedRoute><GPSTracking /></ProtectedRoute>} />
            <Route path="/ai-recommend" element={<ProtectedRoute><AIRecommendation /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/list-equipment" element={<ProtectedRoute><ListEquipment /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
          <EmergencySupport />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;