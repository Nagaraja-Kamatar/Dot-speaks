import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface LoadingStateProps {
  variant?: "page" | "card" | "inline";
  message?: string;
  className?: string;
}

export const LoadingState = ({
  variant = "page",
  message = "Loading...",
  className,
}: LoadingStateProps) => {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    );
  }

  const content = (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary/20" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );

  if (variant === "card") {
    return <Card className={cn("overflow-hidden", className)}>{content}</Card>;
  }

  return (
    <div className={cn("min-h-[400px] flex items-center justify-center", className)}>
      {content}
    </div>
  );
};

// Skeleton Components
interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
}

export const SkeletonCard = ({ lines = 3, showAvatar = false, className }: SkeletonCardProps) => {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start gap-3">
        {showAvatar && (
          <div className="h-10 w-10 rounded-full bg-muted skeleton-shimmer flex-shrink-0" />
        )}
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded bg-muted skeleton-shimmer" />
          {Array.from({ length: lines - 1 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-3 rounded bg-muted skeleton-shimmer",
                i === lines - 2 ? "w-1/2" : "w-full"
              )}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export const SkeletonStats = () => {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 rounded bg-muted skeleton-shimmer" />
          <div className="h-7 w-16 rounded bg-muted skeleton-shimmer" />
          <div className="h-2 w-24 rounded bg-muted skeleton-shimmer" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-muted skeleton-shimmer" />
      </div>
    </Card>
  );
};

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <div className="h-9 w-64 rounded bg-muted skeleton-shimmer" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="h-8 w-8 rounded-full bg-muted skeleton-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-muted skeleton-shimmer" />
              <div className="h-3 w-1/4 rounded bg-muted skeleton-shimmer" />
            </div>
            <div className="h-6 w-20 rounded bg-muted skeleton-shimmer" />
          </div>
        ))}
      </div>
    </Card>
  );
};
