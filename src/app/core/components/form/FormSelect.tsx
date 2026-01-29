import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "@/app/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import { FIELD_CLASSES } from "@/app/core/constants/angelicaLifePlan";
import { cn } from "@/app/core/lib/utils";

interface FormSelectProps {
  label: string;
  id: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  // React Hook Form props
  control?: Control<any>;
  name?: string;
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
  control,
  name,
}: FormSelectProps) {
  // If using React Hook Form, use Controller
  if (control && name) {
    return (
      <div className={FIELD_CLASSES.wrapper}>
        <Label
          htmlFor={id}
          className={cn(FIELD_CLASSES.label, error && "text-red-600")}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </Label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              value={field.value as string}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={id}
                className={cn(
                  FIELD_CLASSES.select,
                  error && "border-red-500 focus:ring-red-500",
                  className,
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
          )}
        />
        {error && (
          <p
            id={`${id}-error`}
            className="text-xs text-red-600 mt-1"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  // Legacy implementation for backward compatibility
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
            className,
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
        <p
          id={`${id}-error`}
          className="text-xs text-red-600 mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
