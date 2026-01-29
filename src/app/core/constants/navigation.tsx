import type { ReactNode } from "react";
import { Home, Clipboard, Loader, Users, UserCog } from "lucide-react";
import {
  buildDashboardPath,
  DASHBOARD_SEGMENTS,
  type DashboardRole,
} from "./dashboardPaths";

export interface NavTab {
  label: string;
  path: string;
  icon: ReactNode;
}

export const getTabsForRole = (role: DashboardRole): NavTab[] => {
  if (role === "admin") {
    return [
      {
        label: "Home",
        path: buildDashboardPath(role, DASHBOARD_SEGMENTS.HOME),
        icon: <Home className="w-5 h-5" />,
      },
      {
        label: "Waiting List",
        path: buildDashboardPath(role, DASHBOARD_SEGMENTS.WAITING),
        icon: <Loader className="w-5 h-5" />,
      },
      {
        label: "Client List",
        path: buildDashboardPath(role, DASHBOARD_SEGMENTS.CLIENTS),
        icon: <Users className="w-5 h-5" />,
      },
      {
        label: "Agent List",
        path: buildDashboardPath(role, DASHBOARD_SEGMENTS.AGENTS),
        icon: <UserCog className="w-5 h-5" />,
      },
      {
        label: "Users",
        path: buildDashboardPath(role, DASHBOARD_SEGMENTS.USERS),
        icon: <Users className="w-5 h-5" />,
      },
    ];
  }

  if (role === "sales") {
    return [
      {
        label: "Home",
        path: buildDashboardPath(role, DASHBOARD_SEGMENTS.HOME),
        icon: <Home className="w-5 h-5" />,
      },
      {
        label: "Plan List",
        path: buildDashboardPath(role, DASHBOARD_SEGMENTS.PLANS),
        icon: <Clipboard className="w-5 h-5" />,
      },
      {
        label: "Client List",
        path: buildDashboardPath(role, DASHBOARD_SEGMENTS.CLIENTS),
        icon: <Users className="w-5 h-5" />,
      },
      {
        label: "Waiting List",
        path: buildDashboardPath(role, DASHBOARD_SEGMENTS.WAITING),
        icon: <Loader className="w-5 h-5" />,
      },
    ];
  }

  return [
    {
      label: "Home",
      path: buildDashboardPath(role, DASHBOARD_SEGMENTS.HOME),
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Plan List",
      path: buildDashboardPath(role, DASHBOARD_SEGMENTS.PLANS),
      icon: <Clipboard className="w-5 h-5" />,
    },
    {
      label: "Waiting List",
      path: buildDashboardPath(role, DASHBOARD_SEGMENTS.WAITING),
      icon: <Loader className="w-5 h-5" />,
    },
  ];
};
