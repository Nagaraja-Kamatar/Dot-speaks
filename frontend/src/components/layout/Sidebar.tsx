import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ClipboardCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  ListTodo,
  Sparkles,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    roles: ["operator", "manager", "director"],
  },
  {
    icon: ListTodo,
    label: "Tasks",
    path: "/tasks",
    roles: ["operator", "manager", "director"],
  },
  {
    icon: Users,
    label: "Team",
    path: "/team",
    roles: ["manager", "director"],
  },
  {
    icon: BarChart3,
    label: "Performance",
    path: "/performance",
    roles: ["operator", "manager", "director"],
  },
  {
    icon: ClipboardCheck,
    label: "Assessment",
    path: "/assessment",
    roles: ["manager", "director"],
  },
  {
    icon: FileText,
    label: "Reports",
    path: "/reports",
    roles: ["manager", "director"],
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    roles: ["operator", "manager", "director"],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { user, canAccess } = useAuth();

  const filteredNavItems = NAV_ITEMS.filter((item) => canAccess(item.roles));

  const NavLink = ({ item, index }: { item: NavItem; index: number }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

    const linkContent = (
      <Link to={item.path}>
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden",
            isActive
              ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Active indicator */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
          )}
          
          <Icon
            className={cn(
              "h-5 w-5 flex-shrink-0 transition-all duration-300",
              isActive ? "text-white" : "group-hover:scale-110"
            )}
          />
          {!collapsed && (
            <span className="truncate text-sm">{item.label}</span>
          )}
          
          {/* Hover glow effect */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity duration-300",
            !isActive && "group-hover:opacity-100"
          )} />
        </div>
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out",
        "bg-gradient-to-b from-[hsl(238,84%,60%)] via-[hsl(255,80%,55%)] to-[hsl(270,85%,50%)]",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-12 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-0 w-24 h-24 bg-purple-400/10 rounded-full blur-xl" />
      </div>

      {/* Logo */}
      <div className="relative flex items-center h-16 px-4 border-b border-white/10">
        <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden group w-full">
          <img 
            src="/dotspeaks-logo.svg" 
            alt="Dotspeaks Logo" 
            className="h-8 w-auto flex-shrink-0 group-hover:opacity-80 transition-opacity duration-300"
          />
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4 relative">
        <nav className="space-y-1.5">
          {filteredNavItems.map((item, index) => (
            <NavLink key={item.path} item={item} index={index} />
          ))}
        </nav>
      </ScrollArea>

      {/* User Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/10 relative">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xs font-bold text-white uppercase">
                {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/60 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/10 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "w-full justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300",
            !collapsed && "justify-start gap-3 px-3"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};
