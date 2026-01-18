import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Circle,
  XCircle,
  Pause,
} from "lucide-react";

type Status =
  | "todo"
  | "in_progress"
  | "working"
  | "done"
  | "completed"
  | "stuck"
  | "blocked"
  | "on_hold"
  | "active"
  | "pending"
  | "cancelled";

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const STATUS_CONFIG: Record<Status, { 
  label: string; 
  icon: React.ElementType; 
  className: string;
}> = {
  todo: {
    label: "To Do",
    icon: Circle,
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
  pending: {
    label: "Pending",
    icon: Circle,
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    className: "bg-info/10 text-info border-info/30",
  },
  working: {
    label: "Working",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/30",
  },
  active: {
    label: "Active",
    icon: Clock,
    className: "bg-info/10 text-info border-info/30",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/30",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/30",
  },
  stuck: {
    label: "Stuck",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  blocked: {
    label: "Blocked",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  on_hold: {
    label: "On Hold",
    icon: Pause,
    className: "bg-warning/10 text-warning border-warning/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-muted text-muted-foreground border-muted-foreground/20 line-through",
  },
};

export const StatusBadge = ({
  status,
  showIcon = true,
  size = "default",
  className,
}: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "_") as Status;
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    default: "text-xs px-2 py-1 gap-1.5",
    lg: "text-sm px-2.5 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "h-2.5 w-2.5",
    default: "h-3 w-3",
    lg: "h-3.5 w-3.5",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border flex items-center",
        sizeClasses[size],
        config.className,
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  );
};
