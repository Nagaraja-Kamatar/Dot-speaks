import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoleGate } from "@/components/ProtectedRoute";
import { teamEmployees } from "@/data/mockData";
import { UserPlus, Star, Users, Mail, MoreHorizontal, TrendingUp, Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Team() {
  const teamStats = {
    total: teamEmployees.length,
    avgPerformance: Math.round(teamEmployees.reduce((acc, emp) => acc + emp.performance, 0) / teamEmployees.length),
    topPerformer: teamEmployees.reduce((prev, curr) => prev.performance > curr.performance ? prev : curr),
  };

  const columns = [
    { 
      key: "name", 
      header: "Member", 
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-sm font-medium">
              {row.name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />{row.email}
            </p>
          </div>
        </div>
      )
    },
    { 
      key: "role", 
      header: "Role",
      cell: (row: any) => (
        <Badge variant="secondary" className="font-medium">{row.role}</Badge>
      )
    },
    { 
      key: "department", 
      header: "Department",
      cell: (row: any) => (
        <span className="text-sm text-muted-foreground">{row.department}</span>
      )
    },
    { 
      key: "tasksCompleted", 
      header: "Tasks", 
      cell: (row: any) => (
        <div className="text-sm">
          <span className="font-semibold text-success">{row.tasksCompleted}</span>
          <span className="text-muted-foreground"> / {row.tasksCompleted + row.tasksInProgress}</span>
        </div>
      )
    },
    { 
      key: "performance", 
      header: "Performance", 
      cell: (row: any) => (
        <div className="flex items-center gap-3 min-w-[140px]">
          <Progress value={row.performance} className="h-2 flex-1" />
          <span className="text-sm font-semibold flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-warning fill-warning" />
            {row.performance}%
          </span>
        </div>
      )
    },
    {
      key: "actions",
      header: "",
      cell: (row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Assign Task</DropdownMenuItem>
            <DropdownMenuItem>Send Message</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <AppLayout>
      <PageHeader 
        title="Team" 
        description="Manage your team members" 
        icon={Users}
        actions={
          <RoleGate allowedRoles={["manager", "director"]}>
            <Button className="btn-glow"><UserPlus className="h-4 w-4 mr-2" />Add Member</Button>
          </RoleGate>
        } 
      />

      {/* Team Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 card-interactive">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">{teamStats.total}</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 card-interactive">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-3xl font-bold">{teamStats.avgPerformance}%</p>
              <p className="text-sm text-muted-foreground">Avg Performance</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 card-interactive">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-warning/20">
              <AvatarFallback className="bg-gradient-to-br from-warning/20 to-orange-500/20 text-warning font-medium">
                {teamStats.topPerformer.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{teamStats.topPerformer.name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                Top Performer • {teamStats.topPerformer.performance}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <DataTable 
        data={teamEmployees} 
        columns={columns} 
        searchPlaceholder="Search team members..." 
        className="animate-fade-in-up"
      />
    </AppLayout>
  );
}
