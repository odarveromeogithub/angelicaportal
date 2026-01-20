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
import { DASHBOARD_CLASSES, DASHBOARD_CONFIG, DASHBOARD_MESSAGES } from "@/app/core/constants/dashboard"
import { APP_ROUTES } from "@/app/core/constants/routes"

export default function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { logout: authLogout } = useAuth()
  const { user } = useAppSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearUser())
    authLogout()
    navigate(APP_ROUTES.LOGIN)
  }

  return (
    <div className={DASHBOARD_CLASSES.container}>
      <header className={DASHBOARD_CLASSES.header.wrapper}>
        <div className={DASHBOARD_CLASSES.header.content}>
          <div>
            <h1 className={DASHBOARD_CLASSES.header.logo.title}>{DASHBOARD_CONFIG.appName}</h1>
            <p className={DASHBOARD_CLASSES.header.logo.subtitle}>{DASHBOARD_CONFIG.appSubtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogout}
              className={DASHBOARD_CLASSES.button.logout}
              aria-label="Sign out from your account"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className={DASHBOARD_CLASSES.main}>
        <Card className={DASHBOARD_CLASSES.card.main}>
          <CardHeader className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-5">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-gray-900">Dashboard</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 mt-2">
              {DASHBOARD_MESSAGES.welcome}
            </CardDescription>
          </CardHeader>
          {user?.data && (
            <CardContent className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <Card className={DASHBOARD_CLASSES.card.info}>
                  <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
                    <CardDescription className={DASHBOARD_CLASSES.userInfo.label}>
                      First Name
                    </CardDescription>
                    <CardTitle className={DASHBOARD_CLASSES.userInfo.value}>
                      {user.data.first_name}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className={DASHBOARD_CLASSES.card.info}>
                  <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
                    <CardDescription className={DASHBOARD_CLASSES.userInfo.label}>
                      Last Name
                    </CardDescription>
                    <CardTitle className={DASHBOARD_CLASSES.userInfo.value}>
                      {user.data.last_name}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className={DASHBOARD_CLASSES.card.info}>
                  <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
                    <CardDescription className={DASHBOARD_CLASSES.userInfo.label}>
                      Email
                    </CardDescription>
                    <CardTitle className={DASHBOARD_CLASSES.userInfo.valueSmall}>
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
