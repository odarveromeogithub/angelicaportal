import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl p-3 md:p-4 shadow-sm border border-slate-200 dark:border-slate-800 ${className}`}
    >
      <div className="relative">
        <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 sm:pl-10 md:pl-11 h-10 sm:h-11 text-xs sm:text-sm border-slate-200 dark:border-slate-700 focus-visible:border-blue-400 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-900/40"
        />
      </div>
    </div>
  );
}
