import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RoleGate, PermissionGate } from "@/components/ProtectedRoute";
import { operatorTasks } from "@/data/mockData";
import { Plus, Calendar, ListTodo, Clock, CheckCircle2, AlertCircle, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Tasks() {
  const taskStats = {
    total: operatorTasks.length,
    todo: operatorTasks.filter(t => t.status === "TODO").length,
    working: operatorTasks.filter(t => t.status === "WORKING").length,
    done: operatorTasks.filter(t => t.status === "DONE").length,
    stuck: operatorTasks.filter(t => t.status === "STUCK").length,
  };

  const columns = [
    { 
      key: "title", 
      header: "Task", 
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ListTodo className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-muted-foreground">{row.project}</p>
          </div>
        </div>
      )
    },
    { key: "status", header: "Status", cell: (row: any) => <StatusBadge status={row.status} /> },
    { key: "priority", header: "Priority", cell: (row: any) => <PriorityBadge priority={row.priority} /> },
    { 
      key: "dueDate", 
      header: "Due Date", 
      cell: (row: any) => row.dueDate ? (
        <span className="flex items-center gap-1.5 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          {new Date(row.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      ) : "-" 
    },
    { 
      key: "hoursUsed", 
      header: "Progress", 
      cell: (row: any) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <Progress value={(row.hoursUsed / row.hoursAllocated) * 100} className="h-2 flex-1" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">{row.hoursUsed}h / {row.hoursAllocated}h</span>
        </div>
      )
    },
  ];

  return (
    <AppLayout>
      <PageHeader 
        title="Tasks" 
        description="Manage and track your tasks"
        icon={ListTodo}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <PermissionGate permission="create_tasks">
              <Button className="btn-glow"><Plus className="h-4 w-4 mr-2" />New Task</Button>
            </PermissionGate>
          </div>
        }
      />

      {/* Task Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
              <ListTodo className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{taskStats.total}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{taskStats.working}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{taskStats.done}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-interactive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{taskStats.stuck}</p>
              <p className="text-xs text-muted-foreground">Blocked</p>
            </div>
          </div>
        </Card>
      </div>

      <DataTable 
        data={operatorTasks} 
        columns={columns} 
        searchPlaceholder="Search tasks..." 
        className="animate-fade-in-up"
      />
    </AppLayout>
  );
}
