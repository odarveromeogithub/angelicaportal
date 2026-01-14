import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronLeft, Clock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/app/core/components/ui/button"
import { useAuth } from "@/app/core/context/useAuth"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/core/components/ui/card"
import { Input } from "@/app/core/components/ui/input"

export default function OtpVerification() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useAuth()
  const email = location.state?.email as string

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Redirect if no email passed
  useEffect(() => {
    if (!email) {
      navigate("/register")
    }
  }, [email, navigate])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("OTP expired. Please go back and try again.")
      navigate("/register")
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, navigate])

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only keep last digit

    setOtp(newOtp)

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("")

    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with actual OTP verification API call
      // For now, simulate verification with mock data
      if (otpCode === "123456") {
        toast.success("OTP verified successfully!")
        // Set token and redirect to dashboard after success
        setToken("temp_auth_token_" + Date.now()) // Replace with actual token from API
        setTimeout(() => {
          navigate("/dashboard")
        }, 1500)
      } else {
        const newWrongAttempts = wrongAttempts + 1
        setWrongAttempts(newWrongAttempts)

        if (newWrongAttempts >= 3) {
          toast.error("Too many wrong attempts. Returning to register.")
          setTimeout(() => {
            navigate("/register")
          }, 2000)
        } else {
          toast.error(`Wrong OTP. ${3 - newWrongAttempts} attempts remaining.`)
          setOtp(["", "", "", "", "", ""])
          inputRefs.current[0]?.focus()
        }
      }
    } catch {
      toast.error("Failed to verify OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleVerifyOtp()
        }}
        className="w-full max-w-md"
      >
        
        <Card className="rounded-[32px] border border-blue-100 bg-white/95 shadow-[0_28px_70px_-40px_rgba(14,66,120,0.5)]">
           <CardAction className="self-start p-0 pl-7">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/register")}
                className="h-auto p-0 !text-blue-500 hover:!bg-transparent hover:!text-blue-600"
              >
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  <ChevronLeft className="size-4" />
                  Back to Register
                </span>
              </Button>
            </CardAction>
          <CardHeader className="items-center gap-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-blue-500 bg-white shadow-[0_6px_18px_rgba(40,94,166,0.18)]">
                <span className="text-3xl font-extrabold text-blue-600">C</span>
              </div>
              <div className="leading-tight">
                <h1 className="text-[38px] font-black tracking-wide text-blue-600">
                  CCLPI
                </h1>
                <p className="text-2xl italic text-blue-500">
                  Plans
                </p>
              </div>
            </div>
            <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-700">
              Verify OTP
            </h2>
            <p className="text-sm text-slate-600">
              Enter the 6-digit code sent to {email}
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 px-6 pb-0 sm:px-10">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleInputChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  placeholder="-"
                  className="h-14 w-12 rounded-xl border-2 border-blue-200 bg-white text-center text-2xl font-bold text-blue-600 placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <Clock className="size-4" />
              <span>Time remaining: {formatTime(timeLeft)}</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 pb-8 sm:px-10">
            <Button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className="h-12 w-full rounded-full !bg-[#0d6efd] text-sm font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-[#0b5ed7] disabled:!bg-[#0d6efd]/60"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            {wrongAttempts > 0 && (
              <div className="rounded-xl bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-700">
                {wrongAttempts === 1 && "1 wrong attempt. 2 attempts remaining."}
                {wrongAttempts === 2 && "2 wrong attempts. 1 attempt remaining."}
                {wrongAttempts >= 3 && "Maximum attempts reached."}
              </div>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
