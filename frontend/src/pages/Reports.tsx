import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RoleGate, PermissionGate } from "@/components/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Download, Calendar, Eye, Search, Filter, BarChart3, PieChart, TrendingUp, FileBarChart } from "lucide-react";

const reports = [
  { id: 1, name: "Q4 Performance Report", type: "Performance", date: "2026-01-05", status: "published", icon: BarChart3, downloads: 124 },
  { id: 2, name: "Team Productivity Analysis", type: "Analytics", date: "2026-01-08", status: "draft", icon: TrendingUp, downloads: 0 },
  { id: 3, name: "Project Status Summary", type: "Projects", date: "2026-01-10", status: "published", icon: PieChart, downloads: 89 },
  { id: 4, name: "Monthly KPIs Dashboard", type: "KPIs", date: "2026-01-12", status: "review", icon: FileBarChart, downloads: 45 },
  { id: 5, name: "Resource Allocation Report", type: "Resources", date: "2026-01-14", status: "published", icon: BarChart3, downloads: 67 },
  { id: 6, name: "Budget Overview Q1", type: "Finance", date: "2026-01-15", status: "draft", icon: TrendingUp, downloads: 0 },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "published": return "bg-success/10 text-success border-success/20";
    case "draft": return "bg-muted text-muted-foreground border-muted";
    case "review": return "bg-warning/10 text-warning border-warning/20";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Reports() {
  const stats = {
    total: reports.length,
    published: reports.filter(r => r.status === "published").length,
    drafts: reports.filter(r => r.status === "draft").length,
    totalDownloads: reports.reduce((acc, r) => acc + r.downloads, 0),
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Reports" 
        description="View and manage organizational reports"
        icon={FileText}
        actions={
          <div className="flex gap-2">
            <PermissionGate permission="export_reports">
              <Button variant="outline" className="hidden sm:flex"><Download className="h-4 w-4 mr-2" />Export All</Button>
            </PermissionGate>
            <PermissionGate permission="create_reports">
              <Button className="btn-glow"><Plus className="h-4 w-4 mr-2" />New Report</Button>
            </PermissionGate>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <FileBarChart className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.published}</p>
              <p className="text-xs text-muted-foreground">Published</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.drafts}</p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Download className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalDownloads}</p>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports..." className="pl-10" />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, index) => {
              const Icon = report.icon;
              return (
                <Card key={report.id} className="card-interactive overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className={getStatusStyles(report.status)}>{report.status}</Badge>
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{report.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{report.type}</p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />{report.date}
                      </span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Eye className="h-4 w-4" /></Button>
                        <PermissionGate permission="export_reports">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Download className="h-4 w-4" /></Button>
                        </PermissionGate>
                      </div>
                    </div>
                    {report.downloads > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">{report.downloads} downloads</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="published">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.filter(r => r.status === "published").map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.id} className="card-interactive">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-success" />
                      </div>
                      <Badge className="bg-success/10 text-success border-0">Published</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{report.type}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.filter(r => r.status === "draft" || r.status === "review").map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.id} className="card-interactive">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <Badge variant="outline" className={getStatusStyles(report.status)}>{report.status}</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{report.type}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
