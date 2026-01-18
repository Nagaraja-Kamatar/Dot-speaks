import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  description?: string;
  trend?: {
    value: number;
    label?: string;
    direction?: "up" | "down" | "neutral";
  };
  variant?: "default" | "gradient" | "outline" | "glass";
  className?: string;
  iconClassName?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className,
  iconClassName,
}: StatsCardProps) => {
  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.direction === "up") return "text-success";
    if (trend.direction === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  const TrendIcon = trend?.direction === "up" 
    ? TrendingUp 
    : trend?.direction === "down" 
    ? TrendingDown 
    : Minus;

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-5 transition-all duration-300 card-interactive group",
        variant === "gradient" && "bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border-primary/10",
        variant === "outline" && "bg-transparent border-2 border-dashed",
        variant === "glass" && "glass-card",
        className
      )}
    >
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-6 -bottom-6 w-24 h-24 rounded-full transition-all duration-500 group-hover:scale-125",
        variant === "gradient" 
          ? "bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl" 
          : "bg-gradient-to-br from-muted to-muted/50 blur-2xl"
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full",
                trend.direction === "up" && "bg-success/10 text-success",
                trend.direction === "down" && "bg-destructive/10 text-destructive",
                trend.direction === "neutral" && "bg-muted text-muted-foreground"
              )}>
                <TrendIcon className="h-3 w-3" />
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {(description || trend?.label) && (
            <p className="text-xs text-muted-foreground">
              {description || trend?.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "rounded-xl p-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
            variant === "gradient" 
              ? "bg-gradient-to-br from-primary/20 to-accent/20 text-primary" 
              : "bg-primary/10 text-primary",
            iconClassName
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
};
