import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonStats, SkeletonCard } from "@/components/ui/LoadingState";
import { RoleGate } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import {
  ListTodo, Users, TrendingUp, CheckCircle2, Clock, Target, Briefcase,
  Calendar, Star, ArrowUpRight, Building2, Sparkles, LayoutDashboard,
} from "lucide-react";
import { operatorTasks, operatorStats, teamEmployees, managerStats, projects, pmStats } from "@/data/mockData";

const CHART_COLORS = ["hsl(238, 84%, 67%)", "hsl(270, 95%, 65%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour >= 5 && hour < 12 ? "Good morning" : hour >= 12 && hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="Dashboard" description="Loading your workspace..." icon={LayoutDashboard} />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => <SkeletonStats key={i} />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonCard lines={6} />
          <SkeletonCard lines={6} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(" ")[0]}!`}
        description={new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        icon={Sparkles}
      />

      {/* Operator View */}
      <RoleGate allowedRoles={["operator"]}>
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatsCard title="My Tasks" value={operatorStats.totalTasks} icon={ListTodo} trend={{ value: 12, direction: "up", label: "from last week" }} className="animate-fade-in-up" />
            <StatsCard title="In Progress" value={operatorStats.inProgressTasks} icon={Clock} trend={{ value: 2, direction: "up" }} variant="gradient" className="animate-fade-in-up animation-delay-100" />
            <StatsCard title="Completed" value={operatorStats.completedTasks} icon={CheckCircle2} trend={{ value: 8, direction: "up" }} className="animate-fade-in-up animation-delay-200" />
            <StatsCard title="Completion Rate" value={`${operatorStats.completionRate}%`} icon={Target} trend={{ value: 5, direction: "up" }} className="animate-fade-in-up animation-delay-300" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5 card-interactive animate-fade-in-up animation-delay-400">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={operatorStats.completionTrend}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(238, 84%, 67%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(238, 84%, 67%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", boxShadow: "var(--shadow-lg)" }} />
                  <Area type="monotone" dataKey="rate" stroke="hsl(238, 84%, 67%)" fill="url(#colorRate)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 card-interactive animate-fade-in-up animation-delay-500">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ListTodo className="h-4 w-4 text-primary" />
                  </div>
                  Recent Tasks
                </CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {operatorTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-xl border bg-card/50 hover:bg-muted/50 transition-all duration-200 hover:shadow-sm group">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.project}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={task.priority} size="sm" />
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </RoleGate>

      {/* Manager View */}
      <RoleGate allowedRoles={["manager"]}>
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Team Members" value={managerStats.totalEmployees} icon={Users} trend={{ value: 2, direction: "up" }} className="animate-fade-in-up" />
            <StatsCard title="Active Projects" value={managerStats.activeProjects} icon={Briefcase} variant="gradient" className="animate-fade-in-up animation-delay-100" />
            <StatsCard title="Tasks Completed" value={managerStats.tasksCompleted} icon={CheckCircle2} trend={{ value: 15, direction: "up" }} className="animate-fade-in-up animation-delay-200" />
            <StatsCard title="Avg Performance" value={`${managerStats.avgPerformance}%`} icon={TrendingUp} trend={{ value: 3, direction: "up" }} className="animate-fade-in-up animation-delay-300" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5 card-interactive">
              <CardHeader className="p-0 mb-4"><CardTitle className="text-lg">Monthly Progress</CardTitle></CardHeader>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={managerStats.monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Bar dataKey="tasks" fill="hsl(238, 84%, 67%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 card-interactive">
              <CardHeader className="p-0 mb-4"><CardTitle className="text-lg">Team Performance</CardTitle></CardHeader>
              <div className="space-y-4">
                {teamEmployees.slice(0, 4).map((emp) => (
                  <div key={emp.id} className="flex items-center gap-3 group">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/10"><AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-medium">{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{emp.name}</p>
                      <Progress value={emp.performance} className="h-2 mt-1" />
                    </div>
                    <span className="text-sm font-bold text-primary">{emp.performance}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </RoleGate>

      {/* Director View */}
      <RoleGate allowedRoles={["director"]}>
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Managers" value={pmStats.totalManagers} icon={Briefcase} trend={{ value: 1, direction: "up" }} className="animate-fade-in-up" />
            <StatsCard title="Total Projects" value={pmStats.totalProjects} icon={Target} variant="gradient" className="animate-fade-in-up animation-delay-100" />
            <StatsCard title="All Employees" value={pmStats.totalEmployees} icon={Users} trend={{ value: 5, direction: "up" }} className="animate-fade-in-up animation-delay-200" />
            <StatsCard title="Overall Progress" value={`${pmStats.overallProgress}%`} icon={TrendingUp} trend={{ value: 8, direction: "up" }} className="animate-fade-in-up animation-delay-300" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5 card-interactive">
              <CardHeader className="p-0 mb-4"><CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Department Performance</CardTitle></CardHeader>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pmStats.departmentStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={80} fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Bar dataKey="performance" fill="hsl(238, 84%, 67%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 card-interactive">
              <CardHeader className="p-0 mb-4"><CardTitle className="text-lg">Employee Distribution</CardTitle></CardHeader>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pmStats.departmentStats} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="employees" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pmStats.departmentStats.map((_, index) => (<Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </RoleGate>
    </AppLayout>
  );
}
