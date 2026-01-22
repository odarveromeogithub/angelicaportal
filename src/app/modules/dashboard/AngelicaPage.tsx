import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar } from '../../core/components/dashboard/Sidebar';
import { TopNav } from '../../core/components/dashboard/TopNav';
import { HomeTab } from '../../core/components/dashboard/HomeTab';
import { PlanListTab } from '../../core/components/dashboard/PlanListTab';
import { ClientListTab } from '../../core/components/dashboard/ClientListTab';
import { AgentListTab } from '../../core/components/dashboard/AgentListTab';
import { UsersListTab } from '../../core/components/dashboard/UsersListTab';
import { WaitingListTab } from '../../core/components/dashboard/WaitingListTab';
import { plansActions } from '../../core/state/reducer/dashboard/plansSlice';
import { waitingListActions } from '../../core/state/reducer/dashboard/waitingListSlice';
import { clientListActions } from '../../core/state/reducer/dashboard/clientListSlice';
import { agentListActions } from '../../core/state/reducer/dashboard/agentListSlice';
import { usersListActions } from '../../core/state/reducer/dashboard/usersListSlice';
import { selectDashboardUser, selectIsAdmin, selectIsSales } from '../../core/state/selector/auth.selector';
import { type AppDispatch } from '../../core/state/store';
import { getTabsForRole } from '../../core/constants/navigation';
import { getDashboardRoleFromUser } from '../../core/constants/paths';

export default function AngelicaPage() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use auth selectors instead of pathname detection
  const dashboardUser = useSelector(selectDashboardUser);
  const isAdminRole = useSelector(selectIsAdmin);
  const isSalesRole = useSelector(selectIsSales);
  
  const authenticatedUserRole = dashboardUser?.role || 'client';
  const userRole = getDashboardRoleFromUser(authenticatedUserRole as 'admin' | 'client' | 'sc' | 'um');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user role from auth selector (client, sales, admin)
  const userDisplayRole = dashboardUser?.role || 'client';

  useEffect(() => {
    // Fetch plans and waiting list for all users
    dispatch(plansActions.fetchPlansRequest());
    dispatch(waitingListActions.fetchWaitingListRequest());
    
    // Fetch client list for sales and admin roles
    if (isSalesRole || isAdminRole) {
      dispatch(clientListActions.fetchClientListRequest());
    }

    // Fetch agent list and users list for admin role only
    if (isAdminRole) {
      dispatch(agentListActions.fetchAgentListRequest());
      dispatch(usersListActions.fetchUsersListRequest());
    }
  }, [dispatch, isSalesRole, isAdminRole]);

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
