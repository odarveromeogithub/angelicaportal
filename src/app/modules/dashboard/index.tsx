import { useNavigate } from "react-router-dom"

import { Button } from "@/app/core/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card"
import { useAuth } from "@/app/core/context/useAuth"
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks"
import { logout, clearUser } from "@/app/core/state/reducer/auth"
import type { RootState } from "@/app/core/state/store"

export default function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { logout: authLogout } = useAuth()
  const { user } = useAppSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    // Clear Redux state
    dispatch(logout())
    dispatch(clearUser())
    
    // Clear auth context
    authLogout()
    
    // Redirect to login
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">Angelica Portal</h1>
            <p className="text-sm text-indigo-400">Secure member access</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogout}
              className="h-10 rounded-full px-5 text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Card className="border-indigo-100 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl text-gray-900">Dashboard</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Welcome! You are successfully logged in.
            </CardDescription>
          </CardHeader>
          {user?.data && (
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="rounded-2xl border-indigo-200 bg-indigo-50/80">
                  <CardHeader className="px-6 py-5">
                    <CardDescription className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                      First Name
                    </CardDescription>
                    <CardTitle className="text-2xl text-indigo-900">
                      {user.data.first_name}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="rounded-2xl border-indigo-200 bg-indigo-50/80">
                  <CardHeader className="px-6 py-5">
                    <CardDescription className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                      Last Name
                    </CardDescription>
                    <CardTitle className="text-2xl text-indigo-900">
                      {user.data.last_name}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="rounded-2xl border-indigo-200 bg-indigo-50/80">
                  <CardHeader className="px-6 py-5">
                    <CardDescription className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                      Email
                    </CardDescription>
                    <CardTitle className="text-lg text-indigo-900 break-words">
                      {user.data.email}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  )
}
