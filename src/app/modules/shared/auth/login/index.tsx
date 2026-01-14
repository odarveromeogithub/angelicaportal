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
import type { RootState } from "@/app/core/state/store"
import { useAuth } from "@/app/core/context/useAuth"

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
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
      // Set the token from the login response
      if (loginState.data?.access_token) {
        setToken(loginState.data.access_token)
      }
      toast.success("Login successful! Redirecting to dashboard...")
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
    }
  }, [loginState.success, navigate, loadingToastId, setToken, loginState.data])

  useEffect(() => {
    if (loginState.error) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
      toast.error("Invalid email or password. Please try again.")
    }
  }, [loginState.error, loadingToastId])

  useEffect(() => {
    return () => {
      dispatch(resetLogin())
    }
  }, [dispatch])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!credentials.email || !credentials.password) {
      toast.error("Please enter both email and password")
      return
    }
    const toastId = toast.loading("Signing in...")
    setLoadingToastId(toastId)
    dispatch(login(credentials))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card className="rounded-[32px] border border-blue-100 bg-white/95 shadow-[0_28px_70px_-40px_rgba(14,66,120,0.5)]">
          <CardHeader className="items-center gap-5 text-center">
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
            <p className="text-sm text-slate-600">
              Welcome back! Sign in to continue to CCLPI Plans.
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 px-6 pb-0 sm:px-10">
            {loginState.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                Incorrect email or password. Please try again.
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="relative">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Username"
                  className="h-12 rounded-2xl border-blue-200 bg-white px-12 text-[15px] shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                  required
                />
                <UserRound className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-blue-500" />
              </div>

              <div className="relative">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="h-12 rounded-2xl border-blue-200 bg-white px-12 text-[15px] shadow-xs placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-200"
                  required
                />
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-blue-500" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-7 rounded-full px-2 text-xs font-semibold uppercase tracking-wide text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 pb-8 sm:px-10">
            <Button
              type="submit"
              disabled={loginState.loading}
              className="h-12 w-full rounded-full !bg-black text-sm font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-black/90 disabled:!bg-black/60"
            >
              {loginState.loading ? "Signing in..." : "Login"}
            </Button>

            <Button
              type="button"
              asChild
              className="h-12 w-full rounded-full border-0 !bg-[#f5b400] text-sm font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-[#dba100]"
            >
              <Link to="/register">Register Here</Link>
            </Button>

            <Link
              to="#"
              className="text-sm font-medium !text-blue-500 hover:!text-blue-600"
            >
              having trouble logging in?
            </Link>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
