import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar, TopNav } from '../../../core/layout/dashboard';
import { HomeTab, PlanListTab, ClientListTab, AgentListTab, UsersListTab, WaitingListTab } from '../Tabs';
import { useAppSelector } from '../../../core/state/hooks';
import { selectIsAdmin, selectIsSales } from '../../../core/state/selector/auth.selector';
import { getTabsForRole } from '../../../core/constants/navigation';
import { getDashboardRoleFromUser } from '../../../core/constants/dashboard-paths';

export default function AngelicaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use auth selectors instead of pathname detection
  const authUser = useAppSelector((state) => state.auth.user);
  const dashboardUser = authUser as any; // Cast to access all properties
  const isAdminRole = useAppSelector(selectIsAdmin);
  const isSalesRole = useAppSelector(selectIsSales);
  
  const authenticatedUserRole = dashboardUser?.role || 'client';
  const userRole = getDashboardRoleFromUser(authenticatedUserRole as 'admin' | 'client' | 'sc' | 'um');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user role from auth selector (client, sales, admin)
  const userDisplayRole = dashboardUser?.role || 'client';

  useEffect(() => {
    // RTK Query will automatically fetch data on component mount
    // No need to dispatch fetch actions
    // Just navigate to first tab if on root
    if (location.pathname === `/dashboard/${userRole}`) {
      navigate(`/dashboard/${userRole}/home`);
    }
  }, [location.pathname, userRole, navigate]);

  const tabs = getTabsForRole(userRole);

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="md:ml-60">
        <TopNav 
          tabs={tabs} 
          currentTab={location.pathname} 
          onTabChange={handleTabChange}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-32 sm:pt-36 md:pt-40 pb-4 max-w-[1800px] mx-auto"
        >
          <Routes>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeTab userRole={userDisplayRole} />} />
            <Route path="plans" element={<PlanListTab />} />
            <Route path="waiting" element={<WaitingListTab />} />
            
            {(isSalesRole || isAdminRole) && (
              <Route path="clients" element={<ClientListTab />} />
            )}
            
            {isAdminRole && (
              <>
                <Route path="agents" element={<AgentListTab />} />
                <Route path="users" element={<UsersListTab />} />
              </>
            )}
          </Routes>
        </motion.main>
      </div>
    </div>
  );
}
