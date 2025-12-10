import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<FarmerDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/tracking" element={<GPSTracking />} />
          <Route path="/ai-recommend" element={<AIRecommendation />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/list-equipment" element={<ListEquipment />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
        <EmergencySupport />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;