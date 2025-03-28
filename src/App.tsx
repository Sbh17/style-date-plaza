
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import SalonDetails from "./pages/SalonDetails";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import EnvTest from "./pages/EnvTest";
import Welcome from "./pages/Welcome";
import SuperAdminSetup from "./pages/SuperAdminSetup";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TranslationProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/salon/:id" element={<SalonDetails />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/env-test" element={<EnvTest />} />
                <Route path="/setup-superadmin" element={<SuperAdminSetup />} />
                <Route path="/super-admin-setup" element={<SuperAdminSetup />} />
                <Route path="/super-admin" element={<SuperAdminDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TranslationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
