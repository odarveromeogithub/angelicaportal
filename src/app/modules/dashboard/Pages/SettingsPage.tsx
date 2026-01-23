import { motion } from "motion/react";
import { Sidebar, TopNav } from "../../../core/layout/dashboard";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { ErrorBoundary } from "../../../core/components/error";

export default function SettingsPage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine user role based on route
  const isAdminRole = location.pathname.includes("/admin");
  const isSalesRole = location.pathname.includes("/sc");
  const userRole = isAdminRole ? "admin" : isSalesRole ? "sales" : "client";

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          userRole={userRole}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <TopNav minimal onMenuClick={() => setSidebarOpen(true)} />

        <div className="md:ml-60">
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="content-with-topnav-compact min-h-screen flex items-center justify-center px-6 md:px-8 pb-10"
          >
            <div className="text-center space-y-6 w-full max-w-2xl mx-auto">
              <motion.h1
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800"
              >
                Settings
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
          </motion.main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
