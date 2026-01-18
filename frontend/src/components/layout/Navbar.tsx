import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Menu,
  ChevronDown,
  Sparkles,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Navbar = ({ onMenuClick, showMenuButton }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => 
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "director":
        return "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 shadow-sm";
      case "manager":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-sm";
      default:
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-sm";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "director": return "Director";
      case "manager": return "Manager";
      default: return "Operator";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 navbar-blur">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 mr-2 hover:opacity-80 transition-opacity">
          <img 
            src="/dotspeaks-logo.svg" 
            alt="Dotspeaks Logo" 
            className="h-8 w-auto"
          />
          <span className="hidden sm:inline font-semibold text-sm text-foreground whitespace-nowrap">FlowDash</span>
        </Link>

        {/* Mobile menu button */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-muted/80"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Search */}
        <div className="flex-1 flex items-center max-w-lg">
          <div className="relative w-full hidden sm:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search anything..."
              className="pl-10 pr-12 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all duration-300 focus-visible:bg-background"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-muted-foreground">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-60">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300"
          >
            <div className="relative">
              <Sun className={cn(
                "h-5 w-5 transition-all duration-300",
                isDark ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute"
              )} />
              <Moon className={cn(
                "h-5 w-5 transition-all duration-300",
                isDark ? "rotate-90 scale-0 absolute" : "rotate-0 scale-100"
              )} />
            </div>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted/80 relative transition-all duration-300"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 ring-2 ring-background" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
              <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 bg-muted/30">
                <span className="font-semibold">Notifications</span>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">3 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="m-0" />
              <div className="max-h-72 overflow-y-auto">
                {[
                  { title: "New task assigned", desc: "API Integration - Due in 2 days", time: "5 min ago", icon: "📋" },
                  { title: "Performance review ready", desc: "Your Q4 review is available", time: "1 hour ago", icon: "⭐" },
                  { title: "Team meeting reminder", desc: "Sprint planning at 2:00 PM", time: "2 hours ago", icon: "📅" },
                ].map((notif, i) => (
                  <DropdownMenuItem key={i} className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <span className="text-lg">{notif.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="m-0" />
              <DropdownMenuItem className="justify-center p-3 text-primary cursor-pointer hover:bg-primary/5 font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 px-2 hover:bg-muted/80 transition-all duration-300 h-auto py-1.5"
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/20 transition-all duration-300 hover:ring-primary/40">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-sm font-medium">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {user?.name}
                  </span>
                  <Badge className={cn("text-[10px] h-4 px-1.5 font-medium", getRoleBadgeStyles(user?.role || ""))}>
                    {getRoleLabel(user?.role || "")}
                  </Badge>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
