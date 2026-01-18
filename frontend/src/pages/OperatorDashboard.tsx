import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  TrendingUp,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { operatorTasks, operatorStats, Task } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

// Skeleton Loader
const SkeletonCard = () => (
  <Card className="p-4 h-28 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="h-10 w-10 bg-muted rounded-full skeleton-shimmer" />
      <div className="flex-1">
        <div className="h-4 w-24 bg-muted rounded mb-2 skeleton-shimmer" />
        <div className="h-6 w-16 bg-muted rounded skeleton-shimmer" />
      </div>
    </div>
  </Card>
);

export default function OperatorDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState(operatorStats);
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
    // Simulate API fetch
    const timer = setTimeout(() => {
      setTasks(operatorTasks);
      setStats(operatorStats);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: Task["status"]) => {
    const styles = {
      WORKING: "bg-warning/20 text-warning border-warning/30",
      DONE: "bg-success/20 text-success border-success/30",
      TODO: "bg-muted text-muted-foreground border-muted",
      STUCK: "bg-destructive/20 text-destructive border-destructive/30",
    };
    return styles[status];
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    const styles = {
      HIGH: "bg-destructive text-destructive-foreground",
      MEDIUM: "bg-warning text-warning-foreground",
      LOW: "bg-primary text-primary-foreground",
    };
    return styles[priority];
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 w-72 bg-muted rounded mb-2 skeleton-shimmer" />
            <div className="h-4 w-96 bg-muted rounded skeleton-shimmer" />
          </div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const weeklyHoursLogged = tasks.reduce((sum, t) => sum + (t.hoursUsed || 0), 0);

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="border-b pb-4 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            My Task Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            <span className="font-semibold">{greeting}, {user?.name?.split(" ")[0]} 👋</span>
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> • </span>
            {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={FileText}
            trend={`${stats.completedTasks} completed`}
            trendUp={true}
            color="primary"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgressTasks}
            icon={Clock}
            trend={`${stats.pendingTasks} pending`}
            trendUp={false}
            color="warning"
          />
          <StatsCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={CheckCircle2}
            trend="Up 3% from last week"
            trendUp={true}
            color="success"
          />
          <StatsCard
            title="Hours Logged"
            value={`${weeklyHoursLogged}h`}
            icon={Calendar}
            trend="This week"
            trendUp={true}
            color="primary"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-4 sm:p-6 shadow-card animate-slide-up">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5 text-accent" />
                Hours by Task
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={tasks.map((t) => ({
                  title: t.title.substring(0, 12) + (t.title.length > 12 ? "..." : ""),
                  hours: t.hoursUsed || 0,
                }))}
                margin={{ top: 5, right: 0, left: -20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="title"
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  style={{ fontSize: "10px" }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4 sm:p-6 shadow-card animate-slide-up">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5 text-accent" />
                Completion Trend
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "11px" }} />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => [`${value}%`, "Rate"]}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--success))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Task List */}
        <Card className="p-4 sm:p-6 shadow-card animate-slide-up">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-primary">
              <Target className="h-5 w-5 text-accent" />
              My Assigned Tasks ({stats.inProgressTasks + stats.pendingTasks} Active)
            </h3>
          </div>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p>No tasks assigned</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm sm:text-base">{task.title}</h4>
                        <Badge variant="outline" className={getPriorityBadge(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                        {task.project && <span>{task.project}</span>}
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusBadge(task.status)}>
                      {task.status === "WORKING" && <Clock className="h-3 w-3 mr-1" />}
                      {task.status === "DONE" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {task.status === "STUCK" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {task.status}
                    </Badge>
                  </div>
                  {task.hoursAllocated && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{task.hoursUsed || 0}h used</span>
                        <span>{task.hoursAllocated}h allocated</span>
                      </div>
                      <Progress
                        value={((task.hoursUsed || 0) / task.hoursAllocated) * 100}
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
