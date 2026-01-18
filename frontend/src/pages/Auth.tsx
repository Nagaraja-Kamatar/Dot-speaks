/**
 * Auth.tsx
 * 
 * Combined authentication page with:
 * - Login flow
 * - Signup/Registration flow
 * - Email verification
 * - Password strength indicator
 * - Form validation with Zod
 * - Professional UI/UX
 * - Dark mode support
 * - Responsive design
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Lock, 
  LogIn, 
  Loader2, 
  Zap, 
  Mail, 
  KeyRound, 
  Users, 
  Briefcase, 
  Crown, 
  Sparkles, 
  Moon, 
  Sun,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  MailCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Password must be at least 4 characters")
    .max(100, "Password is too long"),
});

const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

// ============================================
// PASSWORD STRENGTH CALCULATOR
// ============================================

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length * 20;

  let label = "Very Weak";
  let color = "bg-red-500";

  if (score >= 100) {
    label = "Very Strong";
    color = "bg-green-500";
  } else if (score >= 80) {
    label = "Strong";
    color = "bg-green-400";
  } else if (score >= 60) {
    label = "Medium";
    color = "bg-yellow-500";
  } else if (score >= 40) {
    label = "Weak";
    color = "bg-orange-500";
  }

  return { score, label, color, checks };
};

// ============================================
// MAIN AUTH COMPONENT
// ============================================

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const verifyToken = searchParams.get("token");
  const verifyEmail = searchParams.get("email");

  // Mode state
  const [mode, setMode] = useState<"login" | "signup" | "verify" | "verify-success">(
    verifyToken ? "verify" : initialMode
  );

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, signup, verifyEmail: verifyEmailFn, isAuthenticated, loading: authLoading } = useAuth();

  // Password strength
  const passwordStrength = calculatePasswordStrength(signupPassword);

  // Get return URL from location state
  const from = (location.state as { from?: string })?.from || "/dashboard";

  // ============================================
  // INITIALIZATION
  // ============================================

  useEffect(() => {
    // Check system/saved dark mode preference
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);

    // Load remembered email
    const savedEmail = localStorage.getItem("flowdash_remembered_email");
    if (savedEmail) {
      setLoginEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Handle email verification on mount
  useEffect(() => {
    if (verifyToken && verifyEmail && mode === "verify") {
      handleVerifyEmail(verifyEmail, verifyToken);
    }
  }, [verifyToken, verifyEmail, mode]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  // ============================================
  // HANDLERS
  // ============================================

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setErrors({});
  };

  /**
   * Validate login form
   */
  const validateLoginForm = (): boolean => {
    try {
      loginSchema.parse({ email: loginEmail, password: loginPassword });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          if (!fieldErrors[field]) {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  /**
   * Validate signup form
   */
  const validateSignupForm = (): boolean => {
    try {
      signupSchema.parse({ 
        name: signupName, 
        email: signupEmail, 
        password: signupPassword,
        confirmPassword: signupConfirmPassword 
      });
      
      if (!agreeToTerms) {
        setErrors({ terms: "You must agree to the terms and conditions" });
        return false;
      }
      
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          if (!fieldErrors[field]) {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  /**
   * Handle login submission
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateLoginForm()) return;

    setIsLoading(true);

    try {
      const result = await login(loginEmail.trim(), loginPassword);

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem("flowdash_remembered_email", loginEmail.trim());
        } else {
          localStorage.removeItem("flowdash_remembered_email");
        }

        toast({
          title: "Welcome back!",
          description: "Login successful. Redirecting...",
        });
        
        navigate(from, { replace: true });
      } else {
        if (result.requiresVerification) {
          setErrors({ general: "Please verify your email before logging in" });
          toast({
            title: "Email Not Verified",
            description: "Please check your email and verify your account",
            variant: "destructive",
          });
        } else {
          setErrors({ general: result.error || "Invalid credentials" });
          toast({
            title: "Login Failed",
            description: result.error || "Invalid email or password",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle signup submission
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateSignupForm()) return;

    setIsLoading(true);

    try {
      const result = await signup(signupName.trim(), signupEmail.trim(), signupPassword);

      if (result.success) {
        setPendingVerificationEmail(signupEmail.trim());
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
        
        // Clear form
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");
        setAgreeToTerms(false);
      } else {
        setErrors({ general: result.error || "Registration failed" });
        toast({
          title: "Registration Failed",
          description: result.error || "Could not create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle email verification
   */
  const handleVerifyEmail = async (email: string, token: string) => {
    setIsVerifying(true);

    try {
      const result = await verifyEmailFn(email, token);

      if (result.success) {
        setMode("verify-success");
        toast({
          title: "Email Verified!",
          description: "Your account is now active. You can log in.",
        });
      } else {
        setErrors({ general: result.error || "Verification failed" });
        setMode("login");
        toast({
          title: "Verification Failed",
          description: result.error || "Could not verify email",
          variant: "destructive",
        });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
      setMode("login");
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Fill demo credentials
   */
  const fillDemoCredentials = (userType: "operator" | "manager" | "director") => {
    const credentials = {
      operator: { email: "operator@demo.com", password: "demo123" },
      manager: { email: "manager@demo.com", password: "demo123" },
      director: { email: "director@demo.com", password: "demo123" },
    };
    
    setLoginEmail(credentials[userType].email);
    setLoginPassword(credentials[userType].password);
    setErrors({});
  };

  /**
   * Clear field error on input change
   */
  const clearError = (field: string) => {
    if (errors[field] || errors.general) {
      setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  // Show loading while checking auth
  if (authLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {isVerifying ? "Verifying your email..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-pink-500/20 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-pink-900/30" />
      <div className="fixed inset-0 gradient-mesh opacity-60" />

      {/* Floating Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-float opacity-60" />
        <div className="absolute top-1/3 -left-32 w-72 h-72 bg-gradient-to-tr from-blue-500/25 to-purple-500/20 rounded-full blur-3xl animate-float-slow opacity-50" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-bl from-pink-500/30 to-purple-500/20 rounded-full blur-2xl animate-float-delayed opacity-40" />
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 rounded-full glass shadow-glass hover:scale-110 transition-all duration-300"
        aria-label="Toggle dark mode"
        type="button"
      >
        {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-primary" />}
      </button>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-10 animate-fade-in">
          <img 
            src="/dotspeaks-logo.svg" 
            alt="Dotspeaks Logo" 
            className="h-16 w-auto"
          />
        </div>

        {/* Pending Verification Message */}
        {pendingVerificationEmail && (
          <Card className="glass shadow-glass border-0 rounded-3xl overflow-hidden animate-fade-in-up mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <MailCheck className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Check your email</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We've sent a verification link to <strong>{pendingVerificationEmail}</strong>. 
                    Please click the link to verify your account.
                  </p>
                  <Button
                    variant="link"
                    className="px-0 text-primary mt-2"
                    onClick={() => {
                      setPendingVerificationEmail(null);
                      setMode("login");
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Success Message */}
        {mode === "verify-success" && (
          <Card className="glass shadow-glass border-0 rounded-3xl overflow-hidden animate-fade-in-up mb-6">
            <CardContent className="p-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Email Verified!</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6">
                Your account has been successfully verified. You can now log in.
              </p>
              <Button
                onClick={() => setMode("login")}
                className="gradient-primary btn-glow"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Continue to Login
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Auth Card */}
        {!pendingVerificationEmail && mode !== "verify-success" && (
          <Card className="glass shadow-glass border-0 rounded-3xl overflow-hidden animate-fade-in-up">
            <CardHeader className="text-center space-y-4 pb-2 pt-8">
              <div className="mx-auto h-14 w-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center animate-scale-in">
                {mode === "login" ? (
                  <Lock className="h-7 w-7 text-primary" />
                ) : (
                  <UserPlus className="h-7 w-7 text-primary" />
                )}
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </CardTitle>
                <CardDescription className="text-base">
                  {mode === "login" 
                    ? "Sign in to access your dashboard" 
                    : "Sign up to get started with FlowDash"
                  }
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {/* Mode Tabs */}
              <div className="flex rounded-2xl bg-muted/30 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    mode === "login" 
                      ? "bg-background shadow-md text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    mode === "signup" 
                      ? "bg-background shadow-md text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </button>
              </div>

              {/* General Error Alert */}
              {errors.general && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="name@company.com"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          clearError("email");
                        }}
                        autoComplete="email"
                        disabled={isLoading}
                        className={`h-12 pl-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all ${
                          errors.email ? 'border-destructive focus:border-destructive ring-destructive/20' : ''
                        }`}
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          clearError("password");
                        }}
                        autoComplete="current-password"
                        disabled={isLoading}
                        className={`h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all ${
                          errors.password ? 'border-destructive focus:border-destructive ring-destructive/20' : ''
                        }`}
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold gradient-primary rounded-xl btn-glow transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-5 w-5" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* SIGNUP FORM */}
              {mode === "signup" && (
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => {
                          setSignupName(e.target.value);
                          clearError("name");
                        }}
                        autoComplete="name"
                        disabled={isLoading}
                        className={`h-12 pl-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all ${
                          errors.name ? 'border-destructive focus:border-destructive ring-destructive/20' : ''
                        }`}
                        aria-invalid={!!errors.name}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@company.com"
                        value={signupEmail}
                        onChange={(e) => {
                          setSignupEmail(e.target.value);
                          clearError("email");
                        }}
                        autoComplete="email"
                        disabled={isLoading}
                        className={`h-12 pl-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all ${
                          errors.email ? 'border-destructive focus:border-destructive ring-destructive/20' : ''
                        }`}
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => {
                          setSignupPassword(e.target.value);
                          clearError("password");
                        }}
                        autoComplete="new-password"
                        disabled={isLoading}
                        className={`h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all ${
                          errors.password ? 'border-destructive focus:border-destructive ring-destructive/20' : ''
                        }`}
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showSignupPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.password}
                      </p>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {signupPassword && (
                      <div className="space-y-2 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Password strength</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.score >= 80 ? 'text-green-500' :
                            passwordStrength.score >= 60 ? 'text-yellow-500' :
                            passwordStrength.score >= 40 ? 'text-orange-500' : 'text-red-500'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <Progress value={passwordStrength.score} className="h-1.5" />
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          <div className={`flex items-center gap-1.5 ${passwordStrength.checks.length ? 'text-green-500' : 'text-muted-foreground'}`}>
                            <CheckCircle2 className="h-3 w-3" />
                            8+ characters
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordStrength.checks.uppercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                            <CheckCircle2 className="h-3 w-3" />
                            Uppercase
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordStrength.checks.lowercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                            <CheckCircle2 className="h-3 w-3" />
                            Lowercase
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordStrength.checks.number ? 'text-green-500' : 'text-muted-foreground'}`}>
                            <CheckCircle2 className="h-3 w-3" />
                            Number
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordStrength.checks.special ? 'text-green-500' : 'text-muted-foreground'}`}>
                            <CheckCircle2 className="h-3 w-3" />
                            Special char
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => {
                          setSignupConfirmPassword(e.target.value);
                          clearError("confirmPassword");
                        }}
                        autoComplete="new-password"
                        disabled={isLoading}
                        className={`h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all ${
                          errors.confirmPassword ? 'border-destructive focus:border-destructive ring-destructive/20' : ''
                        }`}
                        aria-invalid={!!errors.confirmPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-2 pt-1">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => {
                        setAgreeToTerms(checked === true);
                        clearError("terms");
                      }}
                      disabled={isLoading}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground cursor-pointer leading-tight">
                      I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </Label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in -mt-2">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.terms}
                    </p>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold gradient-primary rounded-xl btn-glow transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-5 w-5" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Demo Credentials (only for login) */}
              {mode === "login" && (
                <div className="mt-8 pt-6 border-t border-border/30">
                  <div className="flex items-center justify-center gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">Demo Accounts</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: "operator" as const, icon: Users, color: "blue", label: "Operator" },
                      { type: "manager" as const, icon: Briefcase, color: "purple", label: "Manager" },
                      { type: "director" as const, icon: Crown, color: "pink", label: "Director" },
                    ].map(({ type, icon: Icon, color, label }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => fillDemoCredentials(type)}
                        disabled={isLoading}
                        className={`group flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-${color}-500/10 to-${color}-600/5 border border-${color}-500/20 hover:border-${color}-500/40 hover:from-${color}-500/15 hover:to-${color}-600/10 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                      >
                        <div className={`h-10 w-10 rounded-xl bg-${color}-500/20 flex items-center justify-center group-hover:bg-${color}-500/30 transition-colors`}>
                          <Icon className={`h-5 w-5 text-${color}-600 dark:text-${color}-400`} />
                        </div>
                        <span className="text-xs font-medium text-foreground">{label}</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Password: <code className="px-2 py-0.5 rounded-md bg-muted/50 font-mono text-primary">demo123</code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8 animate-fade-in">
          © 2026 FlowDash WorkWise. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Auth;
