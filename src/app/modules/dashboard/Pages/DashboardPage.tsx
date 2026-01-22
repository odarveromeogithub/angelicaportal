import { motion } from 'motion/react';
import { Sidebar } from '../../../core/layout/dashboard/Sidebar';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function DashboardPage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine user role based on route
  const isAdminRole = location.pathname.includes('/admin');
  const userRole = isAdminRole ? 'admin' : 'sales';
  const userName = isAdminRole ? 'Admin' : 'SC1';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="md:ml-60">
        {/* Top Bar */}
        <div className="bg-white h-16 md:h-20 border-b border-gray-100 fixed top-0 right-0 left-0 md:left-60 z-30 shadow-sm">
          <div className="flex items-center h-full px-4 sm:px-6 md:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors mr-3"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            <h1 className="text-base md:text-xl font-semibold text-gray-900">Welcome Back, <span className="text-blue-600 font-bold">{userName}</span></h1>
          </div>
        </div>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-16 md:pt-20 h-screen flex items-center justify-center px-6 md:px-8"
        >
          <div className="text-center space-y-6 w-full max-w-2xl mx-auto">
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              Dashboard
            </motion.h1>
            <motion.p
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600">
              Under Construction
            </motion.p>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
