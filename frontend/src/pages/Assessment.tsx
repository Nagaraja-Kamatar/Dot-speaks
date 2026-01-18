import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleGate, PermissionGate } from "@/components/ProtectedRoute";
import { Plus, Star, Calendar, CheckCircle2, Clock, ClipboardCheck, Users, TrendingUp, FileText } from "lucide-react";
import { teamEmployees } from "@/data/mockData";

const assessments = [
  { id: 1, employee: "Alice Johnson", type: "Quarterly Review", status: "completed", score: 92, date: "2026-01-10", feedback: "Excellent performance across all metrics" },
  { id: 2, employee: "Bob Smith", type: "Performance Review", status: "pending", score: null, date: "2026-01-15", feedback: null },
  { id: 3, employee: "Carol Williams", type: "Quarterly Review", status: "in_progress", score: null, date: "2026-01-12", feedback: null },
  { id: 4, employee: "David Brown", type: "Skills Assessment", status: "completed", score: 78, date: "2026-01-08", feedback: "Good technical skills, improve communication" },
  { id: 5, employee: "Eva Martinez", type: "360 Review", status: "completed", score: 95, date: "2026-01-05", feedback: "Outstanding team player and leader" },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed": return { label: "Completed", variant: "default" as const, icon: CheckCircle2, color: "text-success" };
    case "in_progress": return { label: "In Progress", variant: "secondary" as const, icon: Clock, color: "text-warning" };
    default: return { label: "Pending", variant: "outline" as const, icon: Calendar, color: "text-muted-foreground" };
  }
};

export default function Assessment() {
  const stats = {
    total: assessments.length,
    completed: assessments.filter(a => a.status === "completed").length,
    pending: assessments.filter(a => a.status === "pending").length,
    avgScore: Math.round(assessments.filter(a => a.score).reduce((acc, a) => acc + (a.score || 0), 0) / assessments.filter(a => a.score).length),
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Assessments" 
        description="Manage employee performance assessments" 
        icon={ClipboardCheck}
        actions={
          <PermissionGate permission="create_assessments">
            <Button className="btn-glow"><Plus className="h-4 w-4 mr-2" />New Assessment</Button>
          </PermissionGate>
        } 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Assessments</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgScore}%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Recent Assessments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assessments.map((a, index) => {
                  const statusConfig = getStatusConfig(a.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-muted/50 transition-all duration-200 hover:shadow-sm group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-sm font-medium">
                            {a.employee.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{a.employee}</p>
                          <p className="text-xs text-muted-foreground">{a.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {a.score && (
                          <Badge variant="secondary" className="bg-warning/10 text-warning border-0 gap-1">
                            <Star className="h-3 w-3 fill-warning" />{a.score}%
                          </Badge>
                        )}
                        <Badge variant={statusConfig.variant} className="gap-1">
                          <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Team Overview
                </CardTitle>
                <CardDescription>Performance distribution across team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamEmployees.slice(0, 5).map((emp, index) => (
                  <div key={emp.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-medium">
                        {emp.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{emp.name}</p>
                        <span className="text-sm font-semibold text-primary">{emp.performance}%</span>
                      </div>
                      <Progress value={emp.performance} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="card-interactive">
            <CardContent className="pt-6 space-y-3">
              {assessments.filter(a => a.status === "completed").map((a) => {
                const statusConfig = getStatusConfig(a.status);
                return (
                  <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary">{a.employee.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium">{a.employee}</p>
                        <p className="text-xs text-muted-foreground">{a.type} • {a.feedback}</p>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-0 gap-1"><Star className="h-3 w-3 fill-success" />{a.score}%</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="card-interactive">
            <CardContent className="pt-6 space-y-3">
              {assessments.filter(a => a.status === "pending" || a.status === "in_progress").map((a) => {
                const statusConfig = getStatusConfig(a.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary">{a.employee.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium">{a.employee}</p>
                        <p className="text-xs text-muted-foreground">{a.type} • Due {a.date}</p>
                      </div>
                    </div>
                    <Badge variant={statusConfig.variant} className="gap-1"><StatusIcon className="h-3 w-3" />{statusConfig.label}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
