/**
 * AuthContext.tsx
 * 
 * Production-ready authentication context with:
 * - Role-based access control (RBAC)
 * - Session persistence via localStorage
 * - Mock password hashing simulation
 * - Permission-based UI rendering
 * - Auto-login on page refresh
 * - Email verification system
 * - Signup functionality
 */

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

// ============================================
// TYPE DEFINITIONS
// ============================================

export type UserRole = "operator" | "manager" | "director";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  title?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface SignupResult {
  success: boolean;
  error?: string;
  requiresVerification?: boolean;
}

interface LoginResult {
  success: boolean;
  error?: string;
  requiresVerification?: boolean;
}

interface VerifyResult {
  success: boolean;
  error?: string;
}

interface PasswordResetResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (name: string, email: string, password: string) => Promise<SignupResult>;
  verifyEmail: (email: string, token: string) => Promise<VerifyResult>;
  requestPasswordReset: (email: string) => Promise<PasswordResetResult>;
  validateResetToken: (email: string, token: string) => Promise<VerifyResult>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<PasswordResetResult>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  canAccess: (roles: UserRole[]) => boolean;
}

// ============================================
// PERMISSION SYSTEM
// ============================================

export type Permission =
  | "view_dashboard"
  | "view_tasks"
  | "create_tasks"
  | "edit_tasks"
  | "delete_tasks"
  | "assign_tasks"
  | "view_team"
  | "manage_team"
  | "view_performance"
  | "manage_performance"
  | "view_assessments"
  | "create_assessments"
  | "edit_assessments"
  | "view_reports"
  | "create_reports"
  | "edit_reports"
  | "export_reports"
  | "view_settings"
  | "manage_settings"
  | "view_all_data"
  | "manage_organization";

/**
 * Role-based permission mapping
 * Defines what each role can do in the application
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  operator: [
    "view_dashboard",
    "view_tasks",
    "view_performance",
    "view_assessments",
    "view_settings",
  ],
  manager: [
    "view_dashboard",
    "view_tasks",
    "create_tasks",
    "edit_tasks",
    "assign_tasks",
    "view_team",
    "manage_team",
    "view_performance",
    "manage_performance",
    "view_assessments",
    "create_assessments",
    "edit_assessments",
    "view_reports",
    "create_reports",
    "edit_reports",
    "view_settings",
  ],
  director: [
    "view_dashboard",
    "view_tasks",
    "create_tasks",
    "edit_tasks",
    "delete_tasks",
    "assign_tasks",
    "view_team",
    "manage_team",
    "view_performance",
    "manage_performance",
    "view_assessments",
    "create_assessments",
    "edit_assessments",
    "view_reports",
    "create_reports",
    "edit_reports",
    "export_reports",
    "view_settings",
    "manage_settings",
    "view_all_data",
    "manage_organization",
  ],
};

// ============================================
// MOCK USER DATABASE
// ============================================

/**
 * Simulated password hashing
 * In production, this would use bcrypt or similar
 */
const hashPassword = (password: string): string => {
  // Simple hash simulation (NOT secure for production)
  return btoa(password + "_flowdash_salt_2024");
};

/**
 * Generate a verification token
 */
const generateVerificationToken = (): string => {
  return btoa(Math.random().toString(36) + Date.now().toString(36));
};

/**
 * Mock user database with hashed passwords
 */
interface StoredUser {
  hashedPassword: string;
  user: User;
  verificationToken?: string;
}

const DEMO_USERS: Record<string, StoredUser> = {
  "operator@demo.com": {
    hashedPassword: hashPassword("demo123"),
    user: {
      id: "usr_op_001",
      email: "operator@demo.com",
      name: "Alex Thompson",
      role: "operator",
      department: "Engineering",
      title: "Software Developer",
      isVerified: true,
      createdAt: "2024-01-15T10:00:00Z",
    },
  },
  "manager@demo.com": {
    hashedPassword: hashPassword("demo123"),
    user: {
      id: "usr_mgr_001",
      email: "manager@demo.com",
      name: "Sarah Mitchell",
      role: "manager",
      department: "Engineering",
      title: "Engineering Manager",
      isVerified: true,
      createdAt: "2024-01-10T10:00:00Z",
    },
  },
  "director@demo.com": {
    hashedPassword: hashPassword("demo123"),
    user: {
      id: "usr_dir_001",
      email: "director@demo.com",
      name: "Michael Chen",
      role: "director",
      department: "Technology",
      title: "VP of Engineering",
      isVerified: true,
      createdAt: "2024-01-01T10:00:00Z",
    },
  },
};

// Store for registered users (simulates database)
const REGISTERED_USERS_KEY = "flowdash_registered_users";
const PENDING_VERIFICATIONS_KEY = "flowdash_pending_verifications";

/**
 * Get registered users from localStorage
 */
const getRegisteredUsers = (): Record<string, StoredUser> => {
  try {
    const stored = localStorage.getItem(REGISTERED_USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Save registered users to localStorage
 */
const saveRegisteredUsers = (users: Record<string, StoredUser>) => {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

/**
 * Get pending verifications from localStorage
 */
const getPendingVerifications = (): Record<string, { token: string; email: string; expiresAt: number }> => {
  try {
    const stored = localStorage.getItem(PENDING_VERIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Save pending verifications to localStorage
 */
const savePendingVerifications = (verifications: Record<string, { token: string; email: string; expiresAt: number }>) => {
  localStorage.setItem(PENDING_VERIFICATIONS_KEY, JSON.stringify(verifications));
};

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  USER: "flowdash_user",
  TOKEN: "flowdash_token",
  ROLE: "flowdash_role",
} as const;

// Password reset tokens storage
const PASSWORD_RESET_TOKENS_KEY = "flowdash_password_reset_tokens";

const getPasswordResetTokens = (): Record<string, { token: string; expiresAt: number }> => {
  try {
    const stored = localStorage.getItem(PASSWORD_RESET_TOKENS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const savePasswordResetTokens = (tokens: Record<string, { token: string; expiresAt: number }>) => {
  localStorage.setItem(PASSWORD_RESET_TOKENS_KEY, JSON.stringify(tokens));
};

// ============================================
// CONTEXT SETUP
// ============================================

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  verifyEmail: async () => ({ success: false }),
  requestPasswordReset: async () => ({ success: false }),
  validateResetToken: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  logout: () => {},
  hasPermission: () => false,
  canAccess: () => false,
});

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize auth state from localStorage on mount
   * Auto-login if valid session exists
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser);
          
          // Migrate old role if needed
          if (parsedUser.role === "project_manager") {
            parsedUser.role = "director";
          }
          
          setUser(parsedUser);
          setToken(savedToken);
        }
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ROLE);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Generate a mock JWT token
   * In production, this would come from the backend
   */
  const generateToken = (userId: string, role: UserRole): string => {
    const payload = {
      userId,
      role,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    return btoa(JSON.stringify(payload));
  };

  /**
   * Sign up a new user
   */
  const signup = useCallback(async (name: string, email: string, password: string): Promise<SignupResult> => {
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if user already exists in demo users
      if (DEMO_USERS[normalizedEmail]) {
        setLoading(false);
        return { success: false, error: "An account with this email already exists" };
      }

      // Check if user already exists in registered users
      const registeredUsers = getRegisteredUsers();
      if (registeredUsers[normalizedEmail]) {
        setLoading(false);
        return { success: false, error: "An account with this email already exists" };
      }

      // Validate password strength
      if (password.length < 6) {
        setLoading(false);
        return { success: false, error: "Password must be at least 6 characters" };
      }

      // Create verification token
      const verificationToken = generateVerificationToken();
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Create new user
      const newUser: User = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: normalizedEmail,
        name: name.trim(),
        role: "operator", // Default role for new users
        department: "General",
        title: "Team Member",
        isVerified: false,
        createdAt: new Date().toISOString(),
      };

      // Store user
      registeredUsers[normalizedEmail] = {
        hashedPassword: hashPassword(password),
        user: newUser,
        verificationToken,
      };
      saveRegisteredUsers(registeredUsers);

      // Store pending verification
      const pendingVerifications = getPendingVerifications();
      pendingVerifications[normalizedEmail] = {
        token: verificationToken,
        email: normalizedEmail,
        expiresAt,
      };
      savePendingVerifications(pendingVerifications);

      // Simulate sending verification email (in production, call backend API)
      console.log(`[Email Service] Verification email sent to ${normalizedEmail}`);
      console.log(`[Email Service] Verification link: /auth?mode=login&token=${verificationToken}&email=${encodeURIComponent(normalizedEmail)}`);

      setLoading(false);
      return { success: true, requiresVerification: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  }, []);

  /**
   * Verify email with token
   */
  const verifyEmail = useCallback(async (email: string, token: string): Promise<VerifyResult> => {
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check pending verifications
      const pendingVerifications = getPendingVerifications();
      const pending = pendingVerifications[normalizedEmail];

      if (!pending) {
        setLoading(false);
        return { success: false, error: "Verification link is invalid or has expired" };
      }

      if (pending.token !== token) {
        setLoading(false);
        return { success: false, error: "Invalid verification token" };
      }

      if (Date.now() > pending.expiresAt) {
        // Remove expired verification
        delete pendingVerifications[normalizedEmail];
        savePendingVerifications(pendingVerifications);
        setLoading(false);
        return { success: false, error: "Verification link has expired. Please sign up again." };
      }

      // Mark user as verified
      const registeredUsers = getRegisteredUsers();
      if (registeredUsers[normalizedEmail]) {
        registeredUsers[normalizedEmail].user.isVerified = true;
        delete registeredUsers[normalizedEmail].verificationToken;
        saveRegisteredUsers(registeredUsers);
      }

      // Remove pending verification
      delete pendingVerifications[normalizedEmail];
      savePendingVerifications(pendingVerifications);

      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  }, []);

  /**
   * Authenticate user with email and password
   * Returns success status and optional error message
   */
  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check demo users first
      let demoUser = DEMO_USERS[normalizedEmail];
      
      // Check registered users if not found in demo
      if (!demoUser) {
        const registeredUsers = getRegisteredUsers();
        demoUser = registeredUsers[normalizedEmail];
      }

      // Check if user exists
      if (!demoUser) {
        setLoading(false);
        return { success: false, error: "No account found with this email" };
      }

      // Check if email is verified
      if (demoUser.user.isVerified === false) {
        setLoading(false);
        return { 
          success: false, 
          error: "Please verify your email before logging in",
          requiresVerification: true 
        };
      }

      // Verify password (simulated hash comparison)
      const hashedInput = hashPassword(password);
      if (hashedInput !== demoUser.hashedPassword) {
        setLoading(false);
        return { success: false, error: "Incorrect password" };
      }

      // Generate token and set session
      const newToken = generateToken(demoUser.user.id, demoUser.user.role);

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser.user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.ROLE, demoUser.user.role);

      // Update state
      setUser(demoUser.user);
      setToken(newToken);
      setLoading(false);

      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  }, []);

  /**
   * Request password reset
   */
  const requestPasswordReset = useCallback(async (email: string): Promise<PasswordResetResult> => {
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if user exists
      let userExists = !!DEMO_USERS[normalizedEmail];
      if (!userExists) {
        const registeredUsers = getRegisteredUsers();
        userExists = !!registeredUsers[normalizedEmail];
      }

      if (!userExists) {
        setLoading(false);
        return { success: false, error: "No account found with this email" };
      }

      // Generate reset token
      const resetToken = generateVerificationToken();
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

      // Store reset token
      const tokens = getPasswordResetTokens();
      tokens[normalizedEmail] = { token: resetToken, expiresAt };
      savePasswordResetTokens(tokens);

      // Simulate sending email
      console.log(`[Email Service] Password reset email sent to ${normalizedEmail}`);
      console.log(`[Email Service] Reset link: /reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`);

      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  }, []);

  /**
   * Validate password reset token
   */
  const validateResetToken = useCallback(async (email: string, token: string): Promise<VerifyResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const normalizedEmail = email.toLowerCase().trim();
      const tokens = getPasswordResetTokens();
      const stored = tokens[normalizedEmail];

      if (!stored) {
        return { success: false, error: "Invalid or expired reset link" };
      }

      if (stored.token !== token) {
        return { success: false, error: "Invalid reset token" };
      }

      if (Date.now() > stored.expiresAt) {
        // Clean up expired token
        delete tokens[normalizedEmail];
        savePasswordResetTokens(tokens);
        return { success: false, error: "Reset link has expired" };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  }, []);

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(async (email: string, token: string, newPassword: string): Promise<PasswordResetResult> => {
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Validate token first
      const tokenValidation = await validateResetToken(normalizedEmail, token);
      if (!tokenValidation.success) {
        setLoading(false);
        return { success: false, error: tokenValidation.error };
      }

      // Validate new password
      if (newPassword.length < 6) {
        setLoading(false);
        return { success: false, error: "Password must be at least 6 characters" };
      }

      // Update password in registered users
      const registeredUsers = getRegisteredUsers();
      if (registeredUsers[normalizedEmail]) {
        registeredUsers[normalizedEmail].hashedPassword = hashPassword(newPassword);
        saveRegisteredUsers(registeredUsers);
      }

      // Note: Demo users passwords can't be changed (mock database)

      // Remove used token
      const tokens = getPasswordResetTokens();
      delete tokens[normalizedEmail];
      savePasswordResetTokens(tokens);

      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  }, [validateResetToken]);

  /**
   * Clear session and logout user
   */
  const logout = useCallback(() => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  }, []);

  /**
   * Check if current user has a specific permission
   */
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  }, [user]);

  /**
   * Check if current user's role is in the allowed list
   */
  const canAccess = useCallback((roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    signup,
    verifyEmail,
    requestPasswordReset,
    validateResetToken,
    resetPassword,
    logout,
    hasPermission,
    canAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// HOOKS
// ============================================

/**
 * Main auth hook - use this to access auth state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Hook to check a specific permission
 */
export const usePermission = (permission: Permission): boolean => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};

/**
 * Hook to get current user's role
 */
export const useRole = (): UserRole | undefined => {
  const { user } = useAuth();
  return user?.role;
};

/**
 * Hook to check if user has any of the specified roles
 */
export const useHasRole = (roles: UserRole[]): boolean => {
  const { canAccess } = useAuth();
  return canAccess(roles);
};
