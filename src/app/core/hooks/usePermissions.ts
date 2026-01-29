import { useMemo } from "react";
import { useAppSelector } from "../state/hooks";
import { selectAuthUser } from "../state/selector/auth.selector";
import { getDashboardRoleFromUser } from "../constants/dashboardPaths";

export type UserRole = "admin" | "client" | "sc" | "um";
export type DashboardRole = "admin" | "client" | "sales";

export function usePermissions() {
  const currentUser = useAppSelector(selectAuthUser);

  const permissions = useMemo(() => {
    const authenticatedUserRole = (currentUser?.role || "client") as UserRole;
    const dashboardRole = getDashboardRoleFromUser(authenticatedUserRole);

    return {
      // Raw user data
      user: currentUser,
      authenticatedUserRole,
      dashboardRole,

      // Role checks
      isAdmin: dashboardRole === "admin",
      isClient: dashboardRole === "client",
      isSales: dashboardRole === "sales",

      // Permission checks
      canAccessAdminPanel: dashboardRole === "admin",
      canViewAllPlans: dashboardRole === "admin" || dashboardRole === "sales",
      canCreateUsers: dashboardRole === "admin",
      canViewReports: dashboardRole === "admin" || dashboardRole === "sales",
      canManageClients: dashboardRole === "admin" || dashboardRole === "sales",

      // UI helpers
      isNonClientRole: dashboardRole !== "client",
      roleDisplay:
        dashboardRole === "admin"
          ? "AD"
          : dashboardRole === "sales"
            ? "SC"
            : "CL",

      // Referral data
      referralCode:
        currentUser?.referral_code || currentUser?.referral_link_code || "",
      referralUrl: (() => {
        const code =
          currentUser?.referral_code || currentUser?.referral_link_code;
        return code ? `https://sc.cclpi.com.ph/#/referral/${code}` : "";
      })(),
    };
  }, [currentUser]);

  return permissions;
}
