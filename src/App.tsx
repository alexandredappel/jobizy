import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/layouts/AuthLayout";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";

const queryClient = new QueryClient();

const RedirectBasedOnRole = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/signin" replace />;
  
  return <Navigate to={`/${user.role}/dashboard`} replace />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <main className="min-h-screen bg-sand">
            <Routes>
              {/* Root Route */}
              <Route path="/" element={<RedirectBasedOnRole />} />
              
              {/* Auth Routes */}
              <Route path="/signin" element={
                <AuthRoute>
                  <AuthLayout title="Sign in to your account">
                    <SignIn />
                  </AuthLayout>
                </AuthRoute>
              } />
              <Route path="/signup" element={
                <AuthRoute>
                  <AuthLayout title="Create your account">
                    <SignUp />
                  </AuthLayout>
                </AuthRoute>
              } />
              
              {/* Worker Routes */}
              <Route path="/pages/worker/onboarding" element={
                <ProtectedRoute role="worker">
                  <WorkerOnboarding />
                </ProtectedRoute>
              } />
              <Route path="/worker/dashboard" element={
                <ProtectedRoute role="worker">
                  <WorkerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/worker/profile/edit" element={
                <ProtectedRoute role="worker">
                  <WorkerProfileEdit />
                </ProtectedRoute>
              } />
              
              {/* Business Routes */}
              <Route path="/business/onboarding" element={
                <ProtectedRoute role="business">
                  <BusinessOnboarding />
                </ProtectedRoute>
              } />
              <Route path="/business/dashboard" element={
                <ProtectedRoute role="business">
                  <BusinessDashboard />
                </ProtectedRoute>
              } />
              <Route path="/business/profile/edit" element={
                <ProtectedRoute role="business">
                  <BusinessProfileEdit />
                </ProtectedRoute>
              } />
              <Route path="/business/search" element={
                <ProtectedRoute role="business">
                  <Search />
                </ProtectedRoute>
              } />
              
              {/* General Protected Routes */}
              <Route path="/messages" element={
                <ProtectedRoute>
                  <ConversationList />
                </ProtectedRoute>
              } />
              <Route path="/messages/:id" element={
                <ProtectedRoute>
                  <Conversation />
                </ProtectedRoute>
              } />
              <Route path="/worker/:id" element={
                <ProtectedRoute>
                  <WorkerProfile />
                </ProtectedRoute>
              } />
              <Route path="/business/:id" element={
                <ProtectedRoute>
                  <BusinessProfile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
