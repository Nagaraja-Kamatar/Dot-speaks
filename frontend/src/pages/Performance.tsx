import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RoleGate } from "@/components/ProtectedRoute";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, Target, Award, Users, BarChart3, Star, ArrowUpRight, Zap } from "lucide-react";
import { operatorStats, managerStats, pmStats, teamEmployees } from "@/data/mockData";

const skillsData = [
  { skill: "Communication", value: 85 },
  { skill: "Teamwork", value: 90 },
  { skill: "Problem Solving", value: 78 },
  { skill: "Time Mgmt", value: 82 },
  { skill: "Technical", value: 88 },
  { skill: "Leadership", value: 75 },
];

export default function Performance() {
  return (
    <AppLayout>
      <PageHeader 
        title="Performance" 
        description="Track performance metrics and analytics" 
        icon={BarChart3}
      />

      {/* Operator View */}
      <RoleGate allowedRoles={["operator"]}>
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Completion Rate" value={`${operatorStats.completionRate}%`} icon={Target} trend={{ value: 5, direction: "up" }} className="animate-fade-in-up" />
            <StatsCard title="Tasks Done" value={operatorStats.completedTasks} icon={Award} className="animate-fade-in-up animation-delay-100" />
            <StatsCard title="In Progress" value={operatorStats.inProgressTasks} icon={TrendingUp} variant="gradient" className="animate-fade-in-up animation-delay-200" />
            <StatsCard title="Total Tasks" value={operatorStats.totalTasks} icon={Users} className="animate-fade-in-up animation-delay-300" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5 card-interactive animate-fade-in-up animation-delay-400">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  Weekly Trend
                </CardTitle>
              </CardHeader>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={operatorStats.completionTrend}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(238, 84%, 67%)" />
                      <stop offset="100%" stopColor="hsl(270, 95%, 65%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Line type="monotone" dataKey="rate" stroke="url(#lineGradient)" strokeWidth={3} dot={{ fill: "hsl(238, 84%, 67%)", strokeWidth: 0, r: 5 }} activeDot={{ r: 7, fill: "hsl(270, 95%, 65%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 card-interactive animate-fade-in-up animation-delay-500">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-accent" />
                  </div>
                  Skills Assessment
                </CardTitle>
              </CardHeader>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="value" stroke="hsl(238, 84%, 67%)" fill="hsl(238, 84%, 67%)" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </RoleGate>

      {/* Manager & Director View */}
      <RoleGate allowedRoles={["manager", "director"]}>
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Avg Performance" value={`${managerStats.avgPerformance}%`} icon={TrendingUp} trend={{ value: 3, direction: "up" }} className="animate-fade-in-up" />
            <StatsCard title="Team Size" value={managerStats.totalEmployees} icon={Users} className="animate-fade-in-up animation-delay-100" />
            <StatsCard title="Tasks Completed" value={managerStats.tasksCompleted} icon={Award} variant="gradient" className="animate-fade-in-up animation-delay-200" />
            <StatsCard title="Active Projects" value={managerStats.activeProjects} icon={Target} className="animate-fade-in-up animation-delay-300" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5 card-interactive">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Team Performance Overview</CardTitle>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    <ArrowUpRight className="h-3 w-3 mr-1" />+12% this month
                  </Badge>
                </div>
              </CardHeader>
              <div className="space-y-4">
                {teamEmployees.map((emp, index) => (
                  <div key={emp.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-sm font-medium">
                        {emp.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{emp.name}</span>
                        <span className="text-sm font-bold text-primary flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                          {emp.performance}%
                        </span>
                      </div>
                      <Progress value={emp.performance} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 card-interactive">
              <CardHeader className="p-0 mb-4"><CardTitle className="text-lg">Monthly Progress</CardTitle></CardHeader>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={managerStats.monthlyProgress}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(238, 84%, 67%)" />
                      <stop offset="100%" stopColor="hsl(270, 95%, 65%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Bar dataKey="tasks" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </RoleGate>
    </AppLayout>
  );
}
