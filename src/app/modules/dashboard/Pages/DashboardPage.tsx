import { motion } from "motion/react";
import { Sidebar, TopNav } from "../../../core/layout/dashboard";
import { Breadcrumb } from "../../../core/components/ui/breadcrumb";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "../../../core/components/error";

export default function DashboardPage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine user role based on route
  const isAdminRole = location.pathname.includes("/admin");
  const userRole = isAdminRole ? "admin" : "sales";

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
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
                  { label: "Dashboard" },
                ]}
              />
            </div>
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <div className="text-center space-y-6 w-full max-w-2xl mx-auto">
                <motion.h1
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800"
                >
                  Dashboard
                </motion.h1>
                <motion.p
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-gray-600"
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
