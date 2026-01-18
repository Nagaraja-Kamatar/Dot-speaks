import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "success" | "warning" | "destructive";
  iconClassName?: string;
  valueClassName?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "primary",
  iconClassName,
  valueClassName,
}: StatsCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="p-4 sm:p-6 h-full flex flex-col justify-between hover:shadow-card transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("mt-2 font-bold text-2xl sm:text-3xl", valueClassName)}>
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trendUp ? "text-success" : "text-destructive"
              )}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-2 sm:p-3", colorClasses[color])}>
          <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", iconClassName)} />
        </div>
      </div>
    </Card>
  );
};
