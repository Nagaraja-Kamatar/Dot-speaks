import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowRight, ArrowDown, AlertTriangle } from "lucide-react";

type Priority = "critical" | "high" | "medium" | "low";

interface PriorityBadgeProps {
  priority: string;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const PRIORITY_CONFIG: Record<Priority, { 
  label: string; 
  icon: React.ElementType; 
  className: string;
}> = {
  critical: {
    label: "Critical",
    icon: AlertTriangle,
    className: "bg-destructive text-destructive-foreground border-destructive",
  },
  high: {
    label: "High",
    icon: ArrowUp,
    className: "bg-destructive/90 text-destructive-foreground border-destructive",
  },
  medium: {
    label: "Medium",
    icon: ArrowRight,
    className: "bg-warning text-warning-foreground border-warning",
  },
  low: {
    label: "Low",
    icon: ArrowDown,
    className: "bg-success/80 text-success-foreground border-success",
  },
};

export const PriorityBadge = ({
  priority,
  showIcon = true,
  size = "default",
  className,
}: PriorityBadgeProps) => {
  const normalizedPriority = priority.toLowerCase() as Priority;
  const config = PRIORITY_CONFIG[normalizedPriority] || PRIORITY_CONFIG.medium;
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
        "font-medium border-0 flex items-center",
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
