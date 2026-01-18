import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { teamEmployees, managerStats, projects } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour >= 5 && hour < 12
    ? "Good Morning"
    : hour >= 12 && hour < 17
    ? "Good Afternoon"
    : hour >= 17 && hour < 21
    ? "Good Evening"
    : "Good Night";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-success/20 text-success border-success/30",
      completed: "bg-primary/20 text-primary border-primary/30",
      "on-hold": "bg-warning/20 text-warning border-warning/30",
    };
    return styles[status as keyof typeof styles] || "";
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 w-72 bg-muted rounded mb-2 skeleton-shimmer" />
            <div className="h-4 w-96 bg-muted rounded skeleton-shimmer" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="border-b pb-4 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            Team Management Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            <span className="font-semibold">{greeting}, {user?.name?.split(" ")[0]} 👋</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">Manage your team and track progress</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Team Members"
            value={managerStats.totalEmployees}
            icon={Users}
            trend="Active employees"
            trendUp={true}
            color="primary"
          />
          <StatsCard
            title="Active Projects"
            value={managerStats.activeProjects}
            icon={FolderKanban}
            trend="In progress"
            trendUp={true}
            color="warning"
          />
          <StatsCard
            title="Tasks Completed"
            value={managerStats.tasksCompleted}
            icon={CheckCircle2}
            trend="This month"
            trendUp={true}
            color="success"
          />
          <StatsCard
            title="Avg Performance"
            value={`${managerStats.avgPerformance}%`}
            icon={TrendingUp}
            trend="Team average"
            trendUp={true}
            color="primary"
          />
        </div>

        {/* Charts & Projects */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Monthly Progress Chart */}
          <Card className="p-4 sm:p-6 shadow-card animate-slide-up">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5 text-accent" />
                Monthly Task Completion
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={managerStats.monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Active Projects */}
          <Card className="p-4 sm:p-6 shadow-card animate-slide-up">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary">
                <FolderKanban className="h-5 w-5 text-accent" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="p-3 rounded-lg border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <Badge variant="outline" className={getStatusBadge(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.team.length} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{project.completedTasks}/{project.tasksCount} tasks</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Members */}
        <Card className="p-4 sm:p-6 shadow-card animate-slide-up">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary">
              <Users className="h-5 w-5 text-accent" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamEmployees.map((employee) => (
              <div
                key={employee.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {employee.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{employee.name}</h4>
                    <p className="text-xs text-muted-foreground">{employee.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{employee.performance}%</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    {employee.tasksCompleted} done
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-warning" />
                    {employee.tasksInProgress} active
                  </span>
                </div>
                <Progress value={employee.performance} className="h-1.5 mt-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
