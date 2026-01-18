/**
 * ForgotPassword.tsx
 * 
 * Password reset request page with:
 * - Email input with validation
 * - Success/error states
 * - Professional UI matching auth pages
 * - Dark mode support
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Zap, 
  Mail, 
  Moon, 
  Sun,
  AlertCircle,
  ArrowLeft,
  Send,
  MailCheck,
  KeyRound
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

// ============================================
// VALIDATION SCHEMA
// ============================================

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
});

// ============================================
// FORGOT PASSWORD COMPONENT
// ============================================

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { toast } = useToast();
  const { requestPasswordReset } = useAuth();

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
      emailSchema.parse({ email });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string } = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as "email";
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

    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email.trim());

      if (result.success) {
        setIsEmailSent(true);
        toast({
          title: "Reset Link Sent!",
          description: "Check your email for the password reset link.",
        });
      } else {
        setErrors({ general: result.error || "Failed to send reset email" });
        toast({
          title: "Error",
          description: result.error || "Failed to send reset email",
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
          {!isEmailSent ? (
            <>
              <CardHeader className="text-center space-y-4 pb-2 pt-8">
                <div className="mx-auto h-14 w-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center animate-scale-in">
                  <KeyRound className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password?</CardTitle>
                  <CardDescription className="text-base">
                    No worries! Enter your email and we'll send you a reset link.
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

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email || errors.general) {
                            setErrors({});
                          }
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Reset Link
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
          ) : (
            /* Success State */
            <CardContent className="p-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4 animate-scale-in">
                <MailCheck className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Check Your Email</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-2">
                We've sent a password reset link to:
              </p>
              <p className="font-medium text-foreground mb-6">{email}</p>
              <p className="text-xs text-muted-foreground mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  Try Different Email
                </Button>
                <Link to="/auth">
                  <Button className="w-full gradient-primary rounded-xl btn-glow">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
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

export default ForgotPassword;
