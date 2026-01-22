import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { KeyRound, UserRound } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/app/core/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/core/components/ui/card"
import { Input } from "@/app/core/components/ui/input"
import { Label } from "@/app/core/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks"
import { login, resetLogin } from "@/app/core/state/reducer/auth"
import { AUTH_CLASSES, AUTH_MESSAGES } from "@/app/core/constants/auth"
import { loginSchema } from "@/app/core/schemas/auth.schema"
import { buildDashboardPath, DASHBOARD_SEGMENTS } from "@/app/core/constants/dashboard-paths"
import { APP_ROUTES } from "@/app/core/constants/routes"
import { selectLoginState, selectAuthUser } from "@/app/core/state/selector/auth.selector"

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const loginState = useAppSelector(selectLoginState)
  const user = useAppSelector(selectAuthUser)

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(null)

  useEffect(() => {
    if (loginState.success && user) {
      const userData = user;
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
      toast.success(AUTH_MESSAGES.login.success)
      setTimeout(() => {
          // Redirect to dashboard based on user role
          // Admin and Sales Counselor redirect to Dashboard view
          // Client redirects to Angelica/Home view
          let dashboardPath: string;
          if (userData.role === 'admin' || userData.role === 'um') {
            dashboardPath = buildDashboardPath('admin', DASHBOARD_SEGMENTS.DASHBOARD);
          } else if (userData.role === 'sc') {
            dashboardPath = buildDashboardPath('sales', DASHBOARD_SEGMENTS.DASHBOARD);
          } else {
            // Client role
            dashboardPath = buildDashboardPath('client', DASHBOARD_SEGMENTS.HOME);
          }
          navigate(dashboardPath)
      }, 1500)
    }
  }, [loginState.success, user, navigate, loadingToastId])

  useEffect(() => {
    if (loginState.error) {
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
      toast.error(AUTH_MESSAGES.login.error)
    }
  }, [loginState.error, loadingToastId])

  useEffect(() => {
    return () => {
      dispatch(resetLogin())
    }
  }, [dispatch])

  const handleChange = (name: string, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = async () => {
    try {
      await loginSchema.validate(credentials);
      return true;
    } catch (error: unknown) {
      const firstError = error instanceof Error ? error.message : "Validation failed";
      if (firstError) {
        toast.error(firstError);
      }
      return false;
    }
  };

  const isFormValid = () => {
    try {
      loginSchema.validateSync(credentials);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = await validateForm()
    if (!isValid) {
      return
    }
    const toastId = toast.loading(AUTH_MESSAGES.login.loading)
    setLoadingToastId(toastId)
    dispatch(login(credentials))
  }

  return (
    <div className={AUTH_CLASSES.container}>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card className={AUTH_CLASSES.card}>
          <CardHeader className="flex flex-col items-center justify-center gap-5 text-center">
            <div className="flex justify-center w-full">
              <img src="/assets/cclpi-logo.png" alt="CCLPI Plans Logo" className="h-24 object-contain" loading="lazy" />
            </div>
            <p className="text-sm text-slate-600">
              Welcome back! Sign in to continue to CCLPI Plans.
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 px-6 pb-0 sm:px-10">

            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                  <span className="text-red-600 ml-1">*</span>
                </Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-blue-500" aria-hidden="true" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Username"
                    required
                    autoFocus
                    className="h-10 sm:h-11 md:h-12 rounded-2xl border-blue-200 bg-white pl-9 sm:pl-10 md:pl-11 pr-4 text-sm sm:text-[15px] shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                  <span className="text-red-600 ml-1">*</span>
                </Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-blue-500" aria-hidden="true" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Password"
                    required
                    className="h-10 sm:h-11 md:h-12 rounded-2xl border-blue-200 bg-white pl-9 sm:pl-10 md:pl-11 pr-16 sm:pr-20 text-sm sm:text-[15px] shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-6 sm:h-7 rounded-full px-2 text-xs font-semibold uppercase tracking-wide text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 pb-8 sm:px-10">
            <Button
              type="submit"
              disabled={loginState.loading || !isFormValid()}
              className={AUTH_CLASSES.button.dark}
              aria-label="Sign in to your account"
            >
              {loginState.loading ? "Signing in..." : "Login"}
            </Button>

            <Button
              type="button"
              asChild
              className={AUTH_CLASSES.button.yellow}
            >
              <Link to={APP_ROUTES.REGISTER} aria-label="Create new account">Register Here</Link>
            </Button>

            <Link
              to="#"
              className={AUTH_CLASSES.link}
              aria-label="Get help logging in"
            >
              having trouble logging in?
            </Link>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
