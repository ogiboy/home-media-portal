import { cn } from "@/lib/utils";

// Skeleton placeholder block for loading states.
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted/70", className)}
      {...props}
    />
  );
}

export { Skeleton };
