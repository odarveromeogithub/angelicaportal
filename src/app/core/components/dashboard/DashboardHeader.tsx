import { Badge } from '../ui/badge';

interface DashboardHeaderProps {
  title: string;
  description: string;
  count?: number;
  countLabel?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  title,
  description,
  count,
  countLabel = 'Items',
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start sm:items-center justify-between">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm text-gray-500">{description}</p>
          {count !== undefined && (
            <Badge variant="secondary" className="font-normal">
              {count} {count === 1 ? countLabel.replace(/s$/, '') : countLabel}
            </Badge>
          )}
        </div>
      </div>
      {actions && <div className="flex gap-2 md:gap-3 w-full sm:w-auto">{actions}</div>}
    </div>
  );
}

