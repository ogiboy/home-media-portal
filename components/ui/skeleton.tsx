import { cn } from '@/lib/utils';

/**
 * Render a div used as a pulsing skeleton placeholder for loading states.
 *
 * @param className - Optional additional CSS classes to apply to the container
 * @param props - Additional HTML attributes forwarded to the div
 * @returns A div element styled as a pulsing, rounded skeleton placeholder
 */
function Skeleton({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-muted/70', className)}
      {...props}
    />
  );
}

export { Skeleton };