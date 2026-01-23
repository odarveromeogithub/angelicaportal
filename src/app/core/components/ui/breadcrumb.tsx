import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400",
        className,
      )}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-200 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/**
 * Hook to generate breadcrumb items from current location
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = window.location.pathname;
  const segments = location.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    const label = segment
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    items.push({ label, href: path });
  }

  // Make last item non-clickable
  if (items.length > 1) {
    items[items.length - 1].href = undefined;
  }

  return items;
}
