import { Label } from "@/app/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import { FIELD_CLASSES } from "@/app/core/constants/angelica-life-plan";
import { cn } from "@/app/core/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function FormSelect({
  label,
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  required = false,
  error,
  disabled = false,
  className,
}: FormSelectProps) {
  return (
    <div className={FIELD_CLASSES.wrapper}>
      <Label
        htmlFor={id}
        className={cn(FIELD_CLASSES.label, error && "text-red-600")}
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={cn(
            FIELD_CLASSES.select,
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
