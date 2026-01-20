import { useRef, useEffect } from "react"
import { Input } from "@/app/core/components/ui/input"
import { Label } from "@/app/core/components/ui/label"

interface OTPInputProps {
  label?: string
  id: string
  value: string[]
  onChange: (otp: string[]) => void
  length?: number
  disabled?: boolean
  error?: string
  className?: string
}

export function OTPInput({
  label,
  id,
  value,
  onChange,
  length = 6,
  disabled = false,
  error,
  className = "",
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(inputValue)) return

    const newOtp = [...value]
    newOtp[index] = inputValue.slice(-1) // Only keep last digit

    onChange(newOtp)

    // Auto-focus to next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length)
    
    // Only process if all characters are digits
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...value]
    for (let i = 0; i < pastedData.length && i < length; i++) {
      newOtp[i] = pastedData[i]
    }
    
    onChange(newOtp)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : Math.min(nextEmptyIndex, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={`${id}-0`} className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
          {label}
        </Label>
      )}
      <div className="flex justify-center gap-3" role="group" aria-label={label || "OTP input"}>
        {Array.from({ length }).map((_, index) => (
          <Input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            id={`${id}-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            placeholder="-"
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={!!error}
            className={`h-11 sm:h-12 md:h-14 w-10 sm:w-11 md:w-12 rounded-lg sm:rounded-xl border-2 bg-white text-center text-xl sm:text-2xl font-bold text-blue-600 placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${
              error ? "border-red-300" : "border-blue-200"
            }`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}
