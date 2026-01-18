/**
 * ProtectedRoute.tsx
 * 
 * Authentication middleware components for route protection:
 * - ProtectedRoute: Wraps routes requiring authentication
 * - RoleGate: Conditional rendering based on user role
 * - PermissionGate: Conditional rendering based on permission
 */

import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole, Permission } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================

interface ProtectedRouteProps {
  children: ReactNode;
  /** Roles allowed to access this route (if not specified, any authenticated user can access) */
  allowedRoles?: UserRole[];
  /** Specific permission required to access this route */
  requiredPermission?: Permission;
  /** Path to redirect to when access is denied (defaults to appropriate page) */
  fallbackPath?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Handles:
 * - Loading state while checking auth
 * - Redirect to login if not authenticated
 * - Role-based access control
 * - Permission-based access control
 */
export const ProtectedRoute = ({
  children,
  allowedRoles,
  requiredPermission,
  fallbackPath,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading, hasPermission, canAccess } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login with return URL
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role access if specified
  if (allowedRoles && !canAccess(allowedRoles)) {
    // Redirect to dashboard or specified fallback
    const redirectTo = fallbackPath || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  // Check permission if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    const redirectTo = fallbackPath || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};

// ============================================
// ROLE GATE COMPONENT
// ============================================

interface RoleGateProps {
  children: ReactNode;
  /** Roles allowed to see this content */
  allowedRoles: UserRole[];
  /** Fallback content to show when user doesn't have required role */
  fallback?: ReactNode;
}

/**
 * RoleGate Component
 * 
 * Conditionally renders content based on user role.
 * Use for hiding/showing UI elements based on role.
 * 
 * @example
 * <RoleGate allowedRoles={["manager", "director"]}>
 *   <Button>Edit Team</Button>
 * </RoleGate>
 */
export const RoleGate = ({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGateProps) => {
  const { canAccess, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !canAccess(allowedRoles)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// ============================================
// PERMISSION GATE COMPONENT
// ============================================

interface PermissionGateProps {
  children: ReactNode;
  /** Permission required to see this content */
  permission: Permission;
  /** Fallback content to show when user doesn't have permission */
  fallback?: ReactNode;
}

/**
 * PermissionGate Component
 * 
 * Conditionally renders content based on user permission.
 * More granular than RoleGate.
 * 
 * @example
 * <PermissionGate permission="create_tasks">
 *   <Button>New Task</Button>
 * </PermissionGate>
 */
export const PermissionGate = ({ 
  children, 
  permission, 
  fallback = null 
}: PermissionGateProps) => {
  const { hasPermission, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// ============================================
// UTILITY COMPONENTS
// ============================================

interface AuthenticatedOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * AuthenticatedOnly Component
 * 
 * Only renders children if user is authenticated.
 * No role/permission check - just auth status.
 */
export const AuthenticatedOnly = ({ 
  children, 
  fallback = null 
}: AuthenticatedOnlyProps) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface GuestOnlyProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * GuestOnly Component
 * 
 * Only renders children if user is NOT authenticated.
 * Useful for login/signup pages.
 */
export const GuestOnly = ({ 
  children, 
  redirectTo = "/dashboard" 
}: GuestOnlyProps) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};
