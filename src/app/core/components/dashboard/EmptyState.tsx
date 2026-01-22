import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-20 text-gray-500 text-sm md:text-base ${className}`}>
      <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p className="font-medium">{title}</p>
      {description && <p className="text-xs mt-1">{description}</p>}
    </div>
  );
}
