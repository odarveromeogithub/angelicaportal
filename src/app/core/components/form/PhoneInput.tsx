import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "@/app/core/components/ui/label";
import {
  AUTH_CLASSES,
  AUTH_PHONE_CONFIG,
  COUNTRY_CODES,
} from "@/app/core/constants/auth";
import { cn } from "@/app/core/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";

interface PhoneInputProps<T extends FieldValues = FieldValues> {
  label: string;
  id: string;
  name: Path<T>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  countryCode?: string;
  onCountryCodeChange?: (value: string) => void;
  // React Hook Form props
  control?: Control<T>;
}

export function PhoneInput<T extends FieldValues = FieldValues>({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = AUTH_PHONE_CONFIG.placeholder,
  required = false,
  error,
  disabled = false,
  className,
  countryCode = AUTH_PHONE_CONFIG.countryCode,
  onCountryCodeChange,
  control,
}: PhoneInputProps<T>) {
  const renderPhoneInput = (
    fieldValue?: string,
    fieldOnChange?: (value: string) => void,
  ) => (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className={cn(AUTH_CLASSES.label, error && "text-red-600")}
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
      <div className={cn("flex items-center gap-2", className)}>
        {onCountryCodeChange ? (
          <Select
            value={countryCode}
            onValueChange={onCountryCodeChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-[120px] h-10 sm:h-11 md:h-12 rounded-lg sm:rounded-xl border-gray-200 dark:border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_CODES.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="flex items-center justify-center w-[120px] h-10 sm:h-11 md:h-12 rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
            {countryCode}
          </span>
        )}
        <div
          className={cn(
            AUTH_CLASSES.phoneWrapper,
            error && "border-red-500",
            "flex-1",
          )}
        >
          <input
            id={id}
            name={name}
            type="text"
            value={fieldValue ?? value ?? ""}
            onChange={(e) => {
              const cleanedValue = e.target.value
                .replace(/\D/g, "")
                .slice(0, AUTH_PHONE_CONFIG.maxLength);
              if (fieldOnChange) {
                fieldOnChange(cleanedValue);
              } else if (onChange) {
                onChange(cleanedValue);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={AUTH_PHONE_CONFIG.maxLength}
            className={AUTH_CLASSES.phoneInput}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-label={`Phone number without country code`}
          />
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className={AUTH_CLASSES.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          renderPhoneInput(field.value as string | undefined, field.onChange)
        }
      />
    );
  }

  return renderPhoneInput();
}
