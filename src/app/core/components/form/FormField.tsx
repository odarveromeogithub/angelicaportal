import type { UseFormRegisterReturn, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/app/core/components/ui/input";
import { Label } from "@/app/core/components/ui/label";
import { FIELD_CLASSES } from "@/app/core/constants/angelicaLifePlan";
import { cn } from "@/app/core/lib/utils";

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type?: "text" | "email" | "number" | "tel" | "password";
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
  autoFocus?: boolean;
  // React Hook Form props
  registerProps?: UseFormRegisterReturn;
  control?: Control<any>;
  controlName?: string;
}

export function FormField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  maxLength,
  className,
  autoFocus = false,
  registerProps,
  control,
  controlName,
}: FormFieldProps) {
  // If using React Hook Form Controller, use Controller
  if (control && controlName) {
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
          name={controlName}
          control={control}
          render={({ field }) => (
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              autoFocus={autoFocus}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
              className={cn(
                FIELD_CLASSES.input,
                error && "border-red-500 focus-visible:ring-red-500",
                className,
              )}
              {...field}
            />
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

  // Otherwise, use register props
  return (
    <div className={FIELD_CLASSES.wrapper}>
      <Label
        htmlFor={id}
        className={cn(FIELD_CLASSES.label, error && "text-red-600")}
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          FIELD_CLASSES.input,
          error && "border-red-500 focus-visible:ring-red-500",
          className,
        )}
        {...registerProps}
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
