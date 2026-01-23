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
  countLabel = "Items",
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start sm:items-center justify-between">
      <div className="flex items-start gap-4 md:gap-6">
        {count !== undefined && (
          <div className="flex flex-col items-center justify-center min-w-[60px] md:min-w-[80px]">
            <div className="text-3xl md:text-4xl font-bold text-blue-600">
              {count}
            </div>
            <div className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              {count === 1 ? countLabel.replace(/s$/, "") : countLabel}
            </div>
          </div>
        )}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        </div>
      </div>
      {actions && (
        <div className="flex gap-2 md:gap-3 w-full sm:w-auto">{actions}</div>
      )}
    </div>
  );
}
