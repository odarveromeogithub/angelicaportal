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

/**
 * Skeleton for profile page cards
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      {/* QR Code and Referral Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-64 w-64 rounded-xl" />
          <Skeleton className="h-10 w-48 rounded-md" />
          <div className="text-center space-y-2">
            <Skeleton className="h-5 w-40 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
          <div className="w-full max-w-xl space-y-2">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          </div>
          <div className="w-full max-w-xl space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </div>

      {/* Personal Information Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Additional Cards Skeleton */}
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-32 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton };
