
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";

// Home page
import Home from "@/pages/home";

// Auth pages
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Worker pages
import WorkerOnboarding from "@/pages/worker/WorkerOnboarding";
import WorkerDashboard from "@/pages/worker/WorkerDashboard";
import WorkerProfileEdit from "@/pages/worker/WorkerProfileEdit";
import WorkerProfile from "@/pages/profiles/WorkerProfile";

// Business pages
import BusinessOnboarding from "@/pages/business/BusinessOnboarding";
import BusinessDashboard from "@/pages/business/BusinessDashboard";
import BusinessProfileEdit from "@/pages/business/BusinessProfileEdit";
import Search from "@/pages/business/Search";

// i18n configuration
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

// Helper component to manage main content padding
const MainContent = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = ['/signin', '/signup', '/forgot-password', '/reset-password', '/worker/onboarding', '/business/onboarding'].includes(location.pathname);
  
  return (
    <main className={`min-h-screen bg-sand ${!isAuthPage ? 'lg:ml-64 pb-16 lg:pb-0' : ''}`}>
      {children}
    </main>
  );
};

// AppContent component to handle route-specific logic
const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <MainContent>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Worker Routes */}
          <Route 
            path="/worker/onboarding" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerOnboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/worker/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/worker/profile/edit" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerProfileEdit />
              </ProtectedRoute>
            } 
          />
          
          {/* Business Routes */}
          <Route 
            path="/business/onboarding" 
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <BusinessOnboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <BusinessDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business/profile/edit" 
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <BusinessProfileEdit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business/search" 
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <Search />
              </ProtectedRoute>
            } 
          />
          
          {/* Worker Profile (accessible by business users) */}
          <Route 
            path="/worker/:id" 
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <WorkerProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainContent>
    </>
  );
};

const App = () => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Suspense>
);

export default App;
