/**
 * ResetPassword.tsx
 * 
 * Password reset page with:
 * - Token validation
 * - New password input with strength indicator
 * - Confirm password validation
 * - Success/error states
 * - Professional UI
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Zap, 
  KeyRound, 
  Moon, 
  Sun,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Lock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

// ============================================
// VALIDATION SCHEMA
// ============================================

const resetSchema = z.object({
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
// RESET PASSWORD COMPONENT
// ============================================

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { validateResetToken, resetPassword } = useAuth();

  const passwordStrength = calculatePasswordStrength(password);

  // ============================================
  // INITIALIZATION
  // ============================================

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  // Validate token on mount
  useEffect(() => {
    const checkToken = async () => {
      if (!token || !email) {
        setIsTokenValid(false);
        setIsValidating(false);
        return;
      }

      try {
        const result = await validateResetToken(email, token);
        setIsTokenValid(result.success);
      } catch (error) {
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkToken();
  }, [token, email, validateResetToken]);

  // ============================================
  // HANDLERS
  // ============================================

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const validateForm = (): boolean => {
    try {
      resetSchema.parse({ password, confirmPassword });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    if (!token || !email) {
      setErrors({ general: "Invalid reset link" });
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email, token, password);

      if (result.success) {
        setIsSuccess(true);
        toast({
          title: "Password Reset!",
          description: "Your password has been successfully reset.",
        });
      } else {
        setErrors({ general: result.error || "Failed to reset password" });
        toast({
          title: "Error",
          description: result.error || "Failed to reset password",
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

  const clearError = (field: string) => {
    if (errors[field] || errors.general) {
      setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Validating reset link...</p>
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

        {/* Card */}
        <Card className="glass shadow-glass border-0 rounded-3xl overflow-hidden animate-fade-in-up">
          {!isTokenValid ? (
            /* Invalid Token State */
            <CardContent className="p-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4 animate-scale-in">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Invalid or Expired Link</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/forgot-password">
                <Button className="w-full gradient-primary rounded-xl btn-glow">
                  Request New Link
                </Button>
              </Link>
              <div className="mt-4">
                <Link 
                  to="/auth" 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          ) : isSuccess ? (
            /* Success State */
            <CardContent className="p-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4 animate-scale-in">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Password Reset!</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-6">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Link to="/auth">
                <Button className="w-full gradient-primary rounded-xl btn-glow">
                  Continue to Login
                </Button>
              </Link>
            </CardContent>
          ) : (
            /* Reset Form */
            <>
              <CardHeader className="text-center space-y-4 pb-2 pt-8">
                <div className="mx-auto h-14 w-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center animate-scale-in">
                  <Lock className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
                  <CardDescription className="text-base">
                    Enter your new password below
                  </CardDescription>
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* New Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
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
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.password}
                      </p>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {password && (
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
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
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
                          Resetting...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          Reset Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <Link 
                    to="/auth" 
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8 animate-fade-in">
          © 2026 FlowDash WorkWise. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
