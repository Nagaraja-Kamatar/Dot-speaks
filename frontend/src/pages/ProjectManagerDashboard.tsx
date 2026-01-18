import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Building2,
  TrendingUp,
  Target,
  Briefcase,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { pmStats, managers } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--accent))"];

export default function ProjectManagerDashboard() {
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
            Executive Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            <span className="font-semibold">{greeting}, {user?.name?.split(" ")[0]} 👋</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">Organization overview and insights</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Team Managers"
            value={pmStats.totalManagers}
            icon={Briefcase}
            trend="Active managers"
            trendUp={true}
            color="primary"
          />
          <StatsCard
            title="Total Projects"
            value={pmStats.totalProjects}
            icon={Target}
            trend="Across all teams"
            trendUp={true}
            color="warning"
          />
          <StatsCard
            title="Total Employees"
            value={pmStats.totalEmployees}
            icon={Users}
            trend="Organization-wide"
            trendUp={true}
            color="success"
          />
          <StatsCard
            title="Overall Progress"
            value={`${pmStats.overallProgress}%`}
            icon={TrendingUp}
            trend="All projects"
            trendUp={true}
            color="primary"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Department Performance */}
          <Card className="p-4 sm:p-6 shadow-card animate-slide-up">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary">
                <Building2 className="h-5 w-5 text-accent" />
                Department Performance
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pmStats.departmentStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => [`${value}%`, "Performance"]}
                />
                <Bar dataKey="performance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Employee Distribution */}
          <Card className="p-4 sm:p-6 shadow-card animate-slide-up">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary">
                <Users className="h-5 w-5 text-accent" />
                Employee Distribution
              </CardTitle>
            </CardHeader>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pmStats.departmentStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="employees"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pmStats.departmentStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Managers */}
        <Card className="p-4 sm:p-6 shadow-card animate-slide-up">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary">
              <Briefcase className="h-5 w-5 text-accent" />
              Team Managers
            </CardTitle>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {managers.map((manager) => (
              <div
                key={manager.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {manager.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{manager.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {manager.projects} Projects
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {manager.employees}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-bold">{manager.performance}%</span>
                  </div>
                </div>
                <Progress value={manager.performance} className="h-2 mt-3" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
