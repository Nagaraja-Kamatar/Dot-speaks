import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FileText, Search, Users, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "search" | "error";
  className?: string;
}

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className={cn(
        "rounded-full p-4 mb-4",
        variant === "error" ? "bg-destructive/10" : "bg-muted"
      )}>
        <Icon className={cn(
          "h-8 w-8",
          variant === "error" ? "text-destructive" : "text-muted-foreground"
        )} />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};
