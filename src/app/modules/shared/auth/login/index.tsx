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
import { FormField } from "@/app/core/components/form"
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks"
import { login, resetLogin } from "@/app/core/state/reducer/auth"
import type { RootState } from "@/app/core/state/store"
import { useAuth } from "@/app/core/context/useAuth"
import { AUTH_CLASSES, AUTH_MESSAGES } from "@/app/core/constants/auth"
import { loginSchema } from "@/app/core/schemas/auth.schema"
import { APP_ROUTES } from "@/app/core/constants/routes"

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { setToken } = useAuth();
  const { login: loginState } = useAppSelector((state: RootState) => state.auth)

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(null)

  useEffect(() => {
    if (loginState.success) {
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
      if (loginState.data?.access_token) {
        setToken(loginState.data.access_token)
      }
      toast.success(AUTH_MESSAGES.login.success)
      setTimeout(() => {
        navigate(APP_ROUTES.DASHBOARD)
      }, 1500)
    }
  }, [loginState.success, navigate, loadingToastId, setToken, loginState.data])

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) {
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
          <CardHeader className="items-center gap-5 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-blue-500 bg-white shadow-[0_6px_18px_rgba(40,94,166,0.18)]">
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">C</span>
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
            <p className="text-sm text-slate-600">
              Welcome back! Sign in to continue to CCLPI Plans.
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 px-6 pb-0 sm:px-10">
            {loginState.error && (
              <div className={AUTH_CLASSES.error}>
                Incorrect email or password. Please try again.
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="relative">
                <FormField
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Username"
                  required
                  autoFocus
                  className="h-10 sm:h-11 md:h-12 rounded-2xl border-blue-200 bg-white pl-10 sm:pl-11 md:pl-12 pr-4 text-sm sm:text-[15px] shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                />
                <UserRound className="pointer-events-none absolute left-4 top-[47px] size-5 -translate-y-1/2 text-blue-500" aria-hidden="true" />
              </div>

              <div className="relative">
                <FormField
                  label="Password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Password"
                  required
                  className="h-10 sm:h-11 md:h-12 rounded-2xl border-blue-200 bg-white pl-10 sm:pl-11 md:pl-12 pr-16 sm:pr-20 text-sm sm:text-[15px] shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                />
                <KeyRound className="pointer-events-none absolute left-4 top-[47px] size-5 -translate-y-1/2 text-blue-500" aria-hidden="true" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 sm:right-4 top-[42px] sm:top-[45px] md:top-[48px] -translate-y-1/2 h-6 sm:h-7 rounded-full px-2 text-xs font-semibold uppercase tracking-wide text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
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
              <Link to="/register" aria-label="Create new account">Register Here</Link>
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
