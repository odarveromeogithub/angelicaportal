import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronLeft, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/app/core/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card"
import { Input } from "@/app/core/components/ui/input"
import { Label } from "@/app/core/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks"
import { register, resetRegister } from "@/app/core/state/reducer/auth"
import type { RootState } from "@/app/core/state/store"

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { register: registerState } = useAppSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    contact_no: "",
    area: "",
  })

  const [countryCode, setCountryCode] = useState("+63")

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(null)

  useEffect(() => {
    if (registerState.success && registerState.data) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
      toast.success("Registration OTP sent! Check your email.")
      setTimeout(() => {
        navigate("/otp", {
          state: { email: formData.email },
        })
        dispatch(resetRegister())
      }, 1500)
    }
  }, [registerState.success, registerState.data, navigate, dispatch, formData.email, loadingToastId])

  useEffect(() => {
    if (registerState.error) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
      toast.error("Registration failed. Please try again.")
    }
  }, [registerState.error, loadingToastId])

  useEffect(() => {
    return () => {
      dispatch(resetRegister())
    }
  }, [dispatch])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target

    // Validation for different input types
    if (name === "contact_no") {
      // Only numbers, max 10 characters (country code +63 is separate)
      if (!/^\d*$/.test(value)) return
      if (value.length > 10) return
    }

    if (name === "first_name" || name === "middle_name" || name === "last_name") {
      // Only letters and spaces
      if (!/^[a-zA-Z\s]*$/.test(value)) return
    }

    if (name === "email") {
      // Allow email characters
      if (!/^[a-zA-Z0-9@._-]*$/.test(value)) return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAreaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      area: value,
    }))
  }

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address (e.g., user@example.com)")
      return false
    }

    // First name validation
    if (formData.first_name.trim().length < 2) {
      toast.error("First name must be at least 2 characters (letters only)")
      return false
    }

    // Last name validation
    if (formData.last_name.trim().length < 2) {
      toast.error("Last name must be at least 2 characters (letters only)")
      return false
    }

    // Contact number validation - exactly 10 digits (+63 is separate)
    if (!/^\d{10}$/.test(formData.contact_no)) {
      toast.error("Contact number must be exactly 10 digits (numbers only, without the 0)")
      return false
    }

    // Area validation
    if (!formData.area) {
      toast.error("Please select an area")
      return false
    }

    return true
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validateForm()) {
      setShowConfirmation(true)
    }
  }

  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return (
      emailRegex.test(formData.email) &&
      formData.first_name.trim().length >= 2 &&
      formData.last_name.trim().length >= 2 &&
      /^\d{10}$/.test(formData.contact_no) &&
      formData.area !== ""
    )
  }

  const handleConfirmRegister = () => {
    setShowConfirmation(false)
    const toastId = toast.loading("Processing registration...")
    setLoadingToastId(toastId)
    dispatch(
      register({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        contact_no: formData.contact_no,
        area: formData.area,
        middle_name: formData.middle_name,
      })
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card className="rounded-[32px] border border-blue-100 bg-white/95 shadow-[0_28px_70px_-40px_rgba(14,66,120,0.5)]">
          <CardAction className="self-start p-0 pl-3">
              <Button
                type="button"
                variant="ghost"
                asChild
                className="h-auto p-0 !text-blue-500 hover:!bg-transparent hover:!text-blue-600"
              >
                <Link to="/login" className="inline-flex items-center gap-1 text-sm font-medium">
                  <ChevronLeft className="size-4" />
                  Return to Login
                </Link>
              </Button>
          </CardAction>
          <CardHeader className="items-center gap-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-blue-500 bg-white shadow-[0_6px_18px_rgba(40,94,166,0.18)]">
                <span className="text-3xl font-extrabold text-blue-600">C</span>
              </div>
              <div className="leading-tight">
                <CardTitle className="text-[38px] font-black tracking-wide text-blue-600">
                  CCLPI
                </CardTitle>
                <CardDescription className="text-2xl italic text-blue-500">
                  Plans
                </CardDescription>
              </div>
            </div>
            <CardTitle className="text-lg font-semibold uppercase tracking-wider text-slate-700">
              Registration
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 px-6 pb-0 sm:px-10">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs italic leading-relaxed text-slate-600">
                For using CCLPI Plans services, you are required to provide your mobile number and/or email address to complete the creation and verification of your account. We value your data privacy, any information gathered and collected is safely secured and manage by CCLPI Plans.
              </p>
            </div>

            {registerState.error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-red-600" />
                <p className="text-sm text-red-600">
                  Registration failed. Please check your information and try again.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="contact_no"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Contact Number
                </Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="h-11 w-24 rounded-xl border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="+63">+63</SelectItem>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="contact_no"
                    name="contact_no"
                    type="tel"
                    required
                    value={formData.contact_no}
                    onChange={handleChange}
                    placeholder="10 digit number"
                    maxLength={10}
                    className="h-11 flex-1 rounded-xl border-slate-300 bg-white px-4 text-sm shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {formData.contact_no.length}/10 digits
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="h-11 rounded-xl border-slate-300 bg-white px-4 text-sm shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="first_name"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  First Name
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="h-11 rounded-xl border-slate-300 bg-white px-4 text-sm shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="middle_name"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Middle Name (Optional)
                </Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  type="text"
                  value={formData.middle_name}
                  onChange={handleChange}
                  placeholder="Middle Name"
                  className="h-11 rounded-xl border-slate-300 bg-white px-4 text-sm shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="last_name"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="h-11 rounded-xl border-slate-300 bg-white px-4 text-sm shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="area"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Area
                </Label>
                <Select
                  value={formData.area || undefined}
                  onValueChange={handleAreaChange}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-300 bg-white px-4 text-sm text-slate-700 shadow-xs">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Metro Manila">Metro Manila</SelectItem>
                    <SelectItem value="Luzon">Luzon</SelectItem>
                    <SelectItem value="Visayas">Visayas</SelectItem>
                    <SelectItem value="Mindanao">Mindanao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 px-6 pb-8 sm:px-10">
            <Button
              type="submit"
              disabled={registerState.loading || !isFormValid()}
              className="mt-2 h-12 w-full rounded-full !bg-[#0d6efd] text-sm font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-[#0b5ed7] disabled:!bg-[#0d6efd]/60 disabled:cursor-not-allowed"
            >
              {registerState.loading ? "Processing..." : "Register"}
            </Button>
            {!isFormValid() && (
              <p className="text-center text-xs text-slate-500">
                Please fill in all required fields correctly
              </p>
            )}
          </CardFooter>
        </Card>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md rounded-[24px] border border-blue-100 bg-white py-8 shadow-2xl">
            <CardHeader className="items-center gap-3 text-center">
              <CardTitle className="text-xl font-semibold text-slate-800">
                Confirm Registration
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Please verify that your information is correct
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-600">Email:</span>
                  <span className="text-sm text-slate-700">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-600">Name:</span>
                  <span className="text-sm text-slate-700">
                    {formData.first_name} {formData.middle_name && `${formData.middle_name} `}
                    {formData.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-600">Contact:</span>
                  <span className="text-sm text-slate-700">{countryCode} {formData.contact_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-600">Area:</span>
                  <span className="text-sm text-slate-700">{formData.area}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-6 sm:flex-row sm:px-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 h-10 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Go Back
              </Button>
              <Button
                type="button"
                onClick={handleConfirmRegister}
                className="flex-1 h-10 rounded-full !bg-[#0d6efd] text-sm font-semibold uppercase !text-white hover:!bg-[#0b5ed7]"
              >
                Confirm
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
