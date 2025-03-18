
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import SalonDetails from "./pages/SalonDetails";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import Promotions from "./pages/Promotions";
import StylistProfiles from "./pages/StylistProfiles";
import LoyaltyProgram from "./pages/LoyaltyProgram";
import Settings from "./pages/Settings";
import Welcome from "./pages/Welcome";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/salon/:id" element={<SalonDetails />} />
    <Route path="/appointments" element={<Appointments />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/sign-in" element={<SignIn />} />
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/super-admin" element={<SuperAdminDashboard />} />
    <Route path="/reviews" element={<Reviews />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/promotions" element={<Promotions />} />
    <Route path="/stylists" element={<StylistProfiles />} />
    <Route path="/loyalty" element={<LoyaltyProgram />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
