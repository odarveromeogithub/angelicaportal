import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchBarProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100 ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 sm:pl-10 md:pl-11 h-10 sm:h-11 text-xs sm:text-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200 focus-visible:ring-2"
        />
      </div>
    </div>
  );
}
