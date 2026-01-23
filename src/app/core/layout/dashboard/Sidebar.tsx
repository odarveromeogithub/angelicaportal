import { useLocation, Link } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAppSelector } from '../../state/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { DASHBOARD_SEGMENTS, type DashboardRole, buildDashboardPath } from '../../constants/dashboard-paths';
import { buildMenuItems } from '../../constants/sidebar-menu';
import { useLogout } from '../../hooks/useLogout';

interface SidebarProps {
  userRole: DashboardRole;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userRole, isOpen = true, onClose }: SidebarProps) {
  const handleLogout = useLogout();
  const location = useLocation();
  
  // Use auth selector to get dashboard user from authenticated user
  const authUser = useAppSelector((state) => state.auth.user);
  const dashboardUser = authUser as any; // Cast to any to access all user properties

  // Get menu items from constants with computed paths
  const finalMenuItems = buildMenuItems(userRole);

  // Custom isActive function for section items (Angelica/Dashboard)
  // These should be active for any path within their section
  const isItemActive = (item: any) => {
    if (item.isSection) {
      const isSettings = location.pathname === buildDashboardPath(userRole, DASHBOARD_SEGMENTS.SETTINGS);
      const isProfile = location.pathname === buildDashboardPath(userRole, DASHBOARD_SEGMENTS.PROFILE);
      
      // For Dashboard, only active when exactly on dashboard path
      if (item.label === 'Dashboard') {
        return location.pathname === item.path;
      }
      
      // For Angelica, active when in angelica section but NOT on dashboard/settings/profile
      if (item.label === 'Angelica') {
        const isDashboard = location.pathname === buildDashboardPath(userRole, DASHBOARD_SEGMENTS.DASHBOARD);
        const parts = item.path.split('/');
        const sectionRoot = parts.slice(0, -1).join('/');
        const isInSection = location.pathname.startsWith(sectionRoot);
        
        return isInSection && !isSettings && !isProfile && !isDashboard;
      }
      
      // Default for other sections
      const parts = item.path.split('/');
      const sectionRoot = parts.slice(0, -1).join('/');
      const isInSection = location.pathname.startsWith(sectionRoot);
      return isInSection && !isSettings && !isProfile;
    }
    return location.pathname === item.path;
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin':
        return 'Administrator';
      case 'sales':
        return 'Sales Counselor';
      default:
        return 'Client';
    }
  };

  const getUserInitials = () => {
    if (dashboardUser?.name) {
      return dashboardUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return userRole === 'admin' ? 'AD' : userRole === 'sales' ? 'SC' : 'CL';
  };

  // Render user avatar section
  const renderUserAvatar = () => {
    const initials = getUserInitials();
    return (
      <Avatar className="w-10 h-10 border-2 border-white">
        <AvatarImage src={dashboardUser?.profile_photo_path} alt={dashboardUser?.name || 'User'} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-gray-100 shadow-lg flex flex-col z-50 transition-transform duration-300",
          "w-64 md:w-60",
          !isOpen && "md:translate-x-0 -translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <img src="/assets/cclpi-logo.png" alt="Angelica Logo" className="h-12 object-contain" loading="lazy" />
        </div>

        {/* User Info */}
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {renderUserAvatar()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {dashboardUser?.name || (userRole === 'admin' ? 'Admin' : userRole === 'sales' ? 'SC' : 'Client')}
              </p>
              <p className="text-xs text-gray-500 truncate">{getRoleLabel()}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {finalMenuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <Link
                to={item.path!}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200',
                  'hover:bg-gray-50',
                  isItemActive(item) ? 'bg-blue-50 border border-blue-100 shadow-sm' : 'bg-transparent'
                )}
                onClick={onClose}
              >
                {(() => {
                  const isActive = isItemActive(item);
                  return (
                    <>
                      <item.icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-colors',
                          isActive ? 'text-blue-600' : 'text-gray-500'
                        )}
                      />
                      <span
                        className={cn(
                          'text-base font-medium transition-colors',
                          isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
                        )}
                      >
                        {item.label}
                      </span>
                    </>
                  );
                })()}
              </Link>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: finalMenuItems.length * 0.05, duration: 0.2 }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 hover:bg-red-50 hover:text-red-600 text-gray-700 bg-transparent"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-base font-medium">Logout</span>
            </button>
          </motion.div>
        </nav>
      </motion.aside>
    </>
  );
}
