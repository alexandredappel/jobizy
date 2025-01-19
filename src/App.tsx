import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";

// Auth Pages
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Worker Pages
import WorkerOnboarding from "@/pages/worker/WorkerOnboarding";
import WorkerDashboard from "@/pages/worker/WorkerDashboard";
import WorkerProfileEdit from "@/pages/worker/WorkerProfileEdit";

// Business Pages
import BusinessOnboarding from "@/pages/business/BusinessOnboarding";
import BusinessDashboard from "@/pages/business/BusinessDashboard";
import BusinessProfileEdit from "@/pages/business/BusinessProfileEdit";
import Search from "@/pages/business/Search";

// General Pages
import WorkerProfile from "@/pages/profiles/WorkerProfile";
import BusinessProfile from "@/pages/profiles/BusinessProfile";

const queryClient = new QueryClient();

// Helper component to manage main content padding
const MainContent = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = ['/signin', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname);
  
  return (
    <main className={`min-h-screen bg-sand ${!isAuthPage ? 'lg:pl-64 pb-16 lg:pb-0' : ''}`}>
      {children}
    </main>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <MainContent>
            <Routes>
              {/* Auth Routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Worker Routes */}
              <Route path="/worker/onboarding" element={<WorkerOnboarding />} />
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />
              <Route path="/worker/profile/edit" element={<WorkerProfileEdit />} />
              
              {/* Business Routes */}
              <Route path="/business/onboarding" element={<BusinessOnboarding />} />
              <Route path="/business/dashboard" element={<BusinessDashboard />} />
              <Route path="/business/profile/edit" element={<BusinessProfileEdit />} />
              <Route path="/business/search" element={<Search />} />
              
              {/* General Routes */}
              <Route path="/worker/:id" element={<WorkerProfile />} />
              <Route path="/business/:id" element={<BusinessProfile />} />
            </Routes>
          </MainContent>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;