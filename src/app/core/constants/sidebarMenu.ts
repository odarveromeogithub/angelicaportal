/**
 * Sidebar Menu Configuration
 * Centralized navigation menu items for different user roles
 */

import { Home, Settings, User, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashboardRole } from "./dashboardPaths";
import { DASHBOARD_SEGMENTS, buildDashboardPath } from "./dashboardPaths";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  badge: string | null;
  isSection: boolean;
  path: string; // Always provided after buildMenuItems
}

/**
 * Base menu items configuration (without paths)
 * Paths are computed at runtime based on user role
 */
export const BASE_MENU_ITEMS: Omit<MenuItem, "path">[] = [
  {
    icon: Home,
    label: "Angelica",
    badge: null,
    isSection: true,
  },
  {
    icon: Settings,
    label: "Settings",
    badge: null,
    isSection: false,
  },
  {
    icon: User,
    label: "Profile",
    badge: null,
    isSection: false,
  },
];

/**
 * Dashboard menu item configuration
 * Only shown for admin and sales roles
 */
export const DASHBOARD_MENU_ITEM: Omit<MenuItem, "path"> = {
  icon: LayoutGrid,
  label: "Dashboard",
  badge: null,
  isSection: true,
};

/**
 * Helper function to build menu items with computed paths
 */
export function buildMenuItems(userRole: DashboardRole): MenuItem[] {
  const baseItems: MenuItem[] = [
    {
      ...BASE_MENU_ITEMS[0], // Angelica
      path: buildDashboardPath(userRole, DASHBOARD_SEGMENTS.HOME),
    },
    {
      ...BASE_MENU_ITEMS[1], // Settings
      path: buildDashboardPath(userRole, DASHBOARD_SEGMENTS.SETTINGS),
    },
    {
      ...BASE_MENU_ITEMS[2], // Profile
      path: buildDashboardPath(userRole, DASHBOARD_SEGMENTS.PROFILE),
    },
  ];

  // Add dashboard menu for sales & admin roles at the beginning
  if (userRole === "admin" || userRole === "sales") {
    const dashboardItem: MenuItem = {
      ...DASHBOARD_MENU_ITEM,
      path: buildDashboardPath(userRole, DASHBOARD_SEGMENTS.DASHBOARD),
    };
    return [dashboardItem, ...baseItems];
  }

  return baseItems;
}
