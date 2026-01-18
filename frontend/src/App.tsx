/**
 * App.tsx
 * 
 * Main application component with:
 * - Route configuration
 * - Protected routes with role-based access
 * - Authentication provider
 * - Global providers (Query, Tooltip, Toast)
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, GuestOnly } from "@/components/ProtectedRoute";

// Page imports
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Team from "./pages/Team";
import Performance from "./pages/Performance";
import Assessment from "./pages/Assessment";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Route Configuration
 * 
 * Public routes:
 * - /auth - Login/Signup page (redirects to dashboard if authenticated)
 * - /forgot-password - Password reset request
 * - /reset-password - Password reset with token
 * 
 * Protected routes (require authentication):
 * - /dashboard - Main dashboard (all roles)
 * - /tasks - Task management (all roles)
 * - /performance - Performance metrics (all roles)
 * - /settings - User settings (all roles)
 * - /profile - User profile (all roles)
 * 
 * Role-restricted routes:
 * - /team - Team management (manager, director only)
 * - /assessment - Assessments (manager, director only)
 * - /reports - Reports (manager, director only)
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        {/* Toast notifications */}
        <Toaster />
        <Sonner />
        
        <BrowserRouter>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Public routes */}
            <Route 
              path="/auth" 
              element={
                <GuestOnly redirectTo="/dashboard">
                  <Auth />
                </GuestOnly>
              } 
            />
            <Route 
              path="/login" 
              element={<Navigate to="/auth" replace />} 
            />
            <Route 
              path="/forgot-password" 
              element={
                <GuestOnly redirectTo="/dashboard">
                  <ForgotPassword />
                </GuestOnly>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <GuestOnly redirectTo="/dashboard">
                  <ResetPassword />
                </GuestOnly>
              } 
            />
            
            {/* Protected routes - All authenticated users */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/performance" 
              element={
                <ProtectedRoute>
                  <Performance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes - Manager & Director only */}
            <Route 
              path="/team" 
              element={
                <ProtectedRoute allowedRoles={["manager", "director"]}>
                  <Team />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessment" 
              element={
                <ProtectedRoute allowedRoles={["manager", "director"]}>
                  <Assessment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={["manager", "director"]}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy route redirects */}
            <Route path="/operator" element={<Navigate to="/dashboard" replace />} />
            <Route path="/manager" element={<Navigate to="/dashboard" replace />} />
            <Route path="/project_manager" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
