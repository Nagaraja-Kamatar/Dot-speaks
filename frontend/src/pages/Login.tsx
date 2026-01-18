/**
 * Login.tsx
 * 
 * Production-ready login page with:
 * - Email/password authentication
 * - Form validation with error messages
 * - Loading states
 * - Password visibility toggle
 * - Remember me functionality
 * - Demo credentials
 * - Dark mode support
 * - Responsive design
 * - Accessibility features
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

// ============================================
// VALIDATION SCHEMA
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

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// LOGIN COMPONENT
// ============================================

const Login = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

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
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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

  /**
   * Validate form using Zod schema
   */
  const validateForm = (): boolean => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as "email" | "password";
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
   * Handle form submission
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("flowdash_remembered_email", email.trim());
        } else {
          localStorage.removeItem("flowdash_remembered_email");
        }

        toast({
          title: "Welcome back!",
          description: "Login successful. Redirecting...",
        });
        
        // Navigate to return URL or dashboard
        navigate(from, { replace: true });
      } else {
        // Show specific error message
        setErrors({ general: result.error || "Invalid credentials" });
        
        toast({
          title: "Login Failed",
          description: result.error || "Invalid email or password",
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
   * Fill demo credentials
   */
  const fillDemoCredentials = (userType: "operator" | "manager" | "director") => {
    const credentials = {
      operator: { email: "operator@demo.com", password: "demo123" },
      manager: { email: "manager@demo.com", password: "demo123" },
      director: { email: "director@demo.com", password: "demo123" },
    };
    
    setEmail(credentials[userType].email);
    setPassword(credentials[userType].password);
    setErrors({});
  };

  /**
   * Clear field error on input change
   */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email || errors.general) {
      setErrors(prev => ({ ...prev, email: undefined, general: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password || errors.general) {
      setErrors(prev => ({ ...prev, password: undefined, general: undefined }));
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
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

        {/* Login Card */}
        <Card className="glass shadow-glass border-0 rounded-3xl overflow-hidden animate-fade-in-up">
          <CardHeader className="text-center space-y-4 pb-2 pt-8">
            <div className="mx-auto h-14 w-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center animate-scale-in">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
              <CardDescription className="text-base">Sign in to access your dashboard</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* General Error Alert */}
            {errors.general && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 animate-fade-in">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    autoComplete="email"
                    disabled={isLoading}
                    className={`h-12 pl-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all ${
                      errors.email ? 'border-destructive focus:border-destructive ring-destructive/20' : ''
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={`h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all ${
                      errors.password ? 'border-destructive focus:border-destructive ring-destructive/20' : ''
                    }`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                  Remember my email
                </Label>
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

            {/* Demo Credentials */}
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
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8 animate-fade-in">
          © 2026 FlowDash WorkWise. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
