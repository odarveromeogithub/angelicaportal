import { motion } from "motion/react";
import { Sidebar, TopNav } from "../../../core/layout/dashboard";
import { Breadcrumb } from "../../../core/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../core/state/hooks";
import { selectAuthUser } from "../../../core/state/selector/auth.selector";
import { getDashboardRoleFromUser } from "../../../core/constants/dashboard-paths";
import { ErrorBoundary } from "../../../core/components/error";
import VerificationPrompt from "../../../core/components/verification/VerificationPrompt";
import { selectIsFullyVerified } from "../../../core/state/selector/auth.selector";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(
    () => !selectIsFullyVerified(),
  );

  // Get user role from Redux auth state (not from pathname)
  const authUser = useAppSelector(selectAuthUser);
  const authenticatedUserRole = authUser?.role || "client";
  const userRole = getDashboardRoleFromUser(
    authenticatedUserRole as "admin" | "client" | "sc" | "um",
  );

  useEffect(() => {
    const handler = () => setShowVerificationPrompt(true);
    window.addEventListener("open-verification-prompt", handler);
    return () =>
      window.removeEventListener("open-verification-prompt", handler);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {showVerificationPrompt && (
          <VerificationPrompt
            open={showVerificationPrompt}
            onClose={() => setShowVerificationPrompt(false)}
          />
        )}
        <Sidebar
          userRole={userRole}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="md:ml-60">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="content-with-topnav-compact min-h-screen px-6 md:px-8 pb-10"
          >
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: "Home", href: "/dashboard" },
                  { label: "Dashboard", href: "#" },
                ]}
              />
            </div>
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <div className="text-center space-y-6 w-full max-w-2xl mx-auto">
                <motion.h1
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white"
                >
                  Dashboard
                </motion.h1>
                <motion.p
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-slate-500 dark:text-slate-400"
                >
                  Under Construction
                </motion.p>
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
