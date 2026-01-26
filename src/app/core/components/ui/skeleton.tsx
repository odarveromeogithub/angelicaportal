import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

/**
 * Skeleton for list items - used for loading states in tables and lists
 */
export function ListItemSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 md:p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <tr
          key={index}
          className="border-b border-gray-50 dark:border-slate-800/60"
        >
          <td className="px-6 py-4">
            <Skeleton className="h-8 w-12 rounded-md" />
          </td>
          <td className="px-6 py-4">
            <Skeleton className="h-6 w-32 rounded-md" />
          </td>
          <td className="px-6 py-4">
            <Skeleton className="h-6 w-40 rounded-md" />
          </td>
          <td className="px-6 py-4">
            <Skeleton className="h-6 w-20 rounded-md" />
          </td>
        </tr>
      ))}
    </>
  );
}

export { Skeleton };
