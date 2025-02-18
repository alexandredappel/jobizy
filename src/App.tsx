
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";

// Lazy loaded components
const Home = lazy(() => import("@/pages/home"));
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const WorkerOnboarding = lazy(() => import("@/pages/worker/WorkerOnboarding"));
const WorkerDashboard = lazy(() => import("@/pages/worker/WorkerDashboard"));
const WorkerProfileEdit = lazy(() => import("@/pages/worker/WorkerProfileEdit"));
const WorkerProfile = lazy(() => import("@/pages/profiles/WorkerProfile"));
const BusinessOnboarding = lazy(() => import("@/pages/business/BusinessOnboarding"));
const BusinessDashboard = lazy(() => import("@/pages/business/BusinessDashboard"));
const BusinessProfileEdit = lazy(() => import("@/pages/business/BusinessProfileEdit"));
const Search = lazy(() => import("@/pages/business/Search"));

// i18n configuration
import './i18n';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

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
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
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
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navigation />
      <MainContent>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          } />
          <Route path="/signin" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SignIn />
            </Suspense>
          } />
          <Route path="/signup" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SignUp />
            </Suspense>
          } />
          <Route path="/forgot-password" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ForgotPassword />
            </Suspense>
          } />
          <Route path="/reset-password" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ResetPassword />
            </Suspense>
          } />
          
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
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Toaster />
            <Sonner />
            <AppContent />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
