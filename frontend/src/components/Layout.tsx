import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  LogOut,
  Clock,
  UserCheck,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const role = user.role.toLowerCase();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavItems = () => {
    const common = [
      { icon: LayoutDashboard, label: "Dashboard", path: `/${role}` },
    ];

    if (role === "manager") {
      return [
        ...common,
        { icon: Users, label: "Employees", path: "/tasks" },
        { icon: Clock, label: "My Tasks", path: "/timesheet" },
        { icon: BarChart3, label: "Performance", path: "/performance" },
        { icon: FileText, label: "Reports", path: "/manager/reports" },
        { icon: UserCheck, label: "HRM", path: "/manager/hrm" },
      ];
    }

    if (role === "project_manager") {
      return [
        ...common,
        { icon: Users, label: "Managers", path: "/tasks" },
        { icon: BarChart3, label: "Performance", path: "/performance" },
        { icon: UserCheck, label: "Assignments", path: "/project_manager/assignments" },
        { icon: FileText, label: "Reports", path: "/manager/reports" },
      ];
    }

    if (role === "operator") {
      return [
        ...common,
        { icon: Clock, label: "My Tasks", path: "/timesheet" },
        { icon: UserCheck, label: "HRM", path: "/operator/hrm" },
      ];
    }

    return common;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card shadow-md p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-primary hover:bg-muted"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
            <Zap className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="font-bold text-primary">FlowDash</span>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground flex flex-col shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-primary-foreground/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FlowDash</h1>
              <p className="text-xs text-primary-foreground/70">WorkWise</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground/90 hover:bg-primary-foreground/10"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors duration-200 ${
                      isActive ? "text-accent" : "text-primary-foreground/90"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-primary-foreground/20 p-4">
          <div className="bg-primary-foreground/10 rounded-lg p-3 text-sm mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary-foreground/80" />
              <span className="capitalize font-medium">{role.replace("_", " ")}</span>
            </div>
            <p className="text-xs text-primary-foreground/70 truncate mt-1">
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
