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
import { FormField, FormSelect, PhoneInput } from "@/app/core/components/form"
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks"
import { register, resetRegister } from "@/app/core/state/reducer/auth";
import { AREA_OPTIONS, AUTH_CLASSES, AUTH_MESSAGES } from "@/app/core/constants/auth"
import { registerSchema } from "@/app/core/schemas/auth.schema"
import { APP_ROUTES } from "@/app/core/constants/routes"
import { selectRegisterState } from "@/app/core/state/selector/auth.selector"

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const registerState = useAppSelector(selectRegisterState)

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    contact_no: "",
    area: "",
  })

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(null)

  useEffect(() => {
    if (registerState.success && registerState.data) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
      toast.success(AUTH_MESSAGES.register.success)
      setTimeout(() => {
        navigate(APP_ROUTES.OTP, {
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
      toast.error(AUTH_MESSAGES.register.error)
    }
  }, [registerState.error, loadingToastId])

  useEffect(() => {
    return () => {
      dispatch(resetRegister())
    }
  }, [dispatch])

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }



  const validateForm = async () => {
    try {
      await registerSchema.validate(formData);
      return true;
    } catch (error: unknown) {
      const firstError = error instanceof Error ? error.message : "Validation failed";
      if (firstError) {
        toast.error(firstError);
      }
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = await validateForm()
    if (isValid) {
      setShowConfirmation(true)
    }
  }

  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    try {
      registerSchema.validateSync(formData);
      return true;
    } catch {
      return false;
    }
  };

  const handleConfirmRegister = () => {
    setShowConfirmation(false)
    const toastId = toast.loading(AUTH_MESSAGES.register.loading)
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
    <div className={AUTH_CLASSES.container}>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card className={AUTH_CLASSES.card}>
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
          <CardHeader className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex justify-center w-full">
              <img src="/assets/cclpi-logo.png" alt="CCLPI Plans Logo" className="h-24 object-contain" loading="lazy" />
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
              <PhoneInput
                label="Contact Number"
                id="contact_no"
                name="contact_no"
                value={formData.contact_no}
                onChange={(value) => handleChange("contact_no", value)}
                placeholder="10 digit number"
                required
              />

              <FormField
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="example@email.com"
                required
              />

              <FormField
                label="First Name"
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                placeholder="First Name"
                required
                autoFocus
              />

              <FormField
                label="Middle Name (Optional)"
                id="middle_name"
                name="middle_name"
                type="text"
                value={formData.middle_name}
                onChange={(e) => handleChange("middle_name", e.target.value)}
                placeholder="Middle Name"
              />

              <FormField
                label="Last Name"
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                placeholder="Last Name"
                required
              />

              <FormSelect
                label="Area"
                id="area"
                value={formData.area}
                onValueChange={(value) => handleChange("area", value)}
                options={AREA_OPTIONS}
                placeholder="Select Area"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 px-6 pb-8 sm:px-10">
            <Button
              type="submit"
              disabled={registerState.loading || !isFormValid()}
              className={AUTH_CLASSES.button.primary}
              aria-label="Submit registration form"
            >
              {registerState.loading ? "Processing..." : "Register"}
            </Button>
            {!isFormValid() && (
              <p className={AUTH_CLASSES.success}>
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-5 pb-6 sm:flex-row sm:gap-3 sm:px-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className={`${AUTH_CLASSES.button.outline} w-full sm:flex-1`}
                aria-label="Go back to edit form"
              >
                Go Back
              </Button>
              <Button
                type="button"
                onClick={handleConfirmRegister}
                className={`${AUTH_CLASSES.button.primary} sm:flex-1 h-10 mt-0`}
                aria-label="Confirm registration"
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
