import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion } from "motion/react";
import { Sidebar, TopNav } from "../../../core/layout/dashboard";
import { Breadcrumb } from "../../../core/components/ui/breadcrumb";
import {
  HomeTab,
  PlanListTab,
  ClientListTab,
  AgentListTab,
  UsersListTab,
  WaitingListTab,
} from "../Tabs";
import { useAppSelector } from "../../../core/state/hooks";
import {
  selectIsAdmin,
  selectIsSales,
  selectAuthUser,
} from "../../../core/state/selector/auth.selector";
import { getTabsForRole } from "../../../core/constants/navigation";
import { getDashboardRoleFromUser } from "../../../core/constants/dashboardPaths";
import VerificationPrompt from "../../../core/components/verification/VerificationPrompt";
import { selectIsFullyVerified } from "../../../core/state/selector/auth.selector";

export default function AngelicaPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Use auth selectors instead of pathname detection
  const authUser = useAppSelector(selectAuthUser);
  const isAdminRole = useAppSelector(selectIsAdmin);
  const isSalesRole = useAppSelector(selectIsSales);

  const authenticatedUserRole = authUser?.role || "client";
  const userRole = getDashboardRoleFromUser(
    authenticatedUserRole as "admin" | "client" | "sc" | "um",
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(
    () => !selectIsFullyVerified(),
  );

  useEffect(() => {
    // Listen for requests to open the verification prompt (e.g., from tooltip)
    const handler = () => setShowVerificationPrompt(true);
    window.addEventListener("open-verification-prompt", handler);
    return () =>
      window.removeEventListener("open-verification-prompt", handler);
  }, []);

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

  // Generate breadcrumb items from current location
  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const items = [{ label: "Home", href: "/dashboard" }];

    if (pathSegments.length > 2) {
      const tabName = pathSegments[2];
      const tabLabel = tabName
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      items.push({ label: tabLabel, href: location.pathname });
    }

    return items;
  };

  return (
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
          className="content-with-topnav pb-4 mx-auto px-4 sm:px-5 md:px-6"
        >
          <div className="mb-4">
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>
          <Routes>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeTab userRole={userRole} />} />
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
