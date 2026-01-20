import { Label } from "@/app/core/components/ui/label";
import { AUTH_CLASSES, AUTH_PHONE_CONFIG } from "@/app/core/constants/auth";
import { cn } from "@/app/core/lib/utils";

interface PhoneInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
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
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, AUTH_PHONE_CONFIG.maxLength);
    onChange(inputValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className={cn(AUTH_CLASSES.label, error && "text-red-600")}
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
      <div className={cn(AUTH_CLASSES.phoneWrapper, error && "border-red-500", className)}>
        <span className={AUTH_CLASSES.phonePrefix}>
          {AUTH_PHONE_CONFIG.countryCode}
        </span>
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={AUTH_PHONE_CONFIG.maxLength}
          className={AUTH_CLASSES.phoneInput}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-label={`Phone number without country code`}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className={AUTH_CLASSES.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
