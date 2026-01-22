import type { IUser } from "../interfaces/user.interface";

export type DashboardRole = "client" | "sales" | "admin";

export const DASHBOARD_ROOT: Record<DashboardRole, string> = {
  client: "/dashboard/angelica",
  sales: "/dashboard/sc/angelica",
  admin: "/dashboard/admin/angelica",
};

export const DASHBOARD_SEGMENTS = {
  HOME: "/home",
  PLANS: "/plans",
  WAITING: "/waiting",
  CLIENTS: "/clients",
  AGENTS: "/agents",
  USERS: "/users",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  DASHBOARD: "/dashboard",
} as const;

export const getDashboardRoleFromUser = (role: IUser["role"]): DashboardRole => {
  if (role === "admin" || role === "um") return "admin";
  if (role === "sc") return "sales";
  return "client";
};

export const getDashboardRootPath = (role: IUser["role"] | DashboardRole): string => {
  const normalizedRole = (role === "sc" || role === "admin" || role === "client" || role === "um")
    ? getDashboardRoleFromUser(role as IUser["role"])
    : (role as DashboardRole);
  return DASHBOARD_ROOT[normalizedRole];
};

export const buildDashboardPath = (role: IUser["role"] | DashboardRole, segment: string) => {
  return `${getDashboardRootPath(role)}${segment}`;
};

export const getDefaultDashboardHome = (role: IUser["role"] | DashboardRole) => {
  return buildDashboardPath(role, DASHBOARD_SEGMENTS.HOME);
};
