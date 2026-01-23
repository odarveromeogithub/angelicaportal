import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4">
          <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for stat cards
 */
export function StatCardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

/**
 * Skeleton for plan cards
 */
export function PlanCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-5">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-48" />
      <div className="space-y-2 pt-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

/**
 * Skeleton for header content
 */
export function HeaderSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for list items
 */
export function ListItemSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-12" />
      </div>
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export { Skeleton };
