import type { IUser } from "../interfaces/user.interface";
import type { DashboardUser, DashboardUserRole } from "../interfaces/dashboard.interface";
import { buildDashboardPath, DASHBOARD_SEGMENTS, getDashboardRootPath } from "../constants/paths";

/**
 * Maps IUser role to DashboardUser role
 * @param userRole - The IUser role ('admin' | 'client' | 'sc' | 'um')
 * @returns The corresponding DashboardUser role ('admin' | 'sales' | 'client')
 */
export const mapUserRoleToDashboardRole = (userRole: IUser["role"]): DashboardUserRole => {
  switch (userRole) {
    case "admin":
      return "admin";
    case "sc":
      return "sales";
    case "client":
      return "client";
    case "um":
      // User Manager - typically has admin-like capabilities
      return "admin";
    default:
      return "client";
  }
};

/**
 * Converts IUser to DashboardUser
 * @param user - The authenticated IUser object
 * @returns DashboardUser object for dashboard context
 */
export const convertUserToDashboardUser = (user: IUser): DashboardUser => {
  return {
    id: user.id.toString(),
    name: user.name || `${user.first_name} ${user.last_name}`.trim() || user.username,
    role: mapUserRoleToDashboardRole(user.role),
    email: user.email,
    // avatar: user.profile_picture || undefined, // Add this field to IUser interface if needed
  };
};

/**
 * Checks if user has admin privileges
 * @param role - The user role
 * @returns True if user is admin or um
 */
export const isAdminUser = (role: IUser["role"]): boolean => {
  return role === "admin" || role === "um";
};

/**
 * Checks if user has sales counselor privileges
 * @param role - The user role
 * @returns True if user is sc
 */
export const isSalesUser = (role: IUser["role"]): boolean => {
  return role === "sc";
};

/**
 * Checks if user is a client
 * @param role - The user role
 * @returns True if user is client
 */
export const isClientUser = (role: IUser["role"]): boolean => {
  return role === "client";
};

/**
 * Gets the appropriate dashboard route based on user role
 * @param role - The user role
 * @returns The dashboard route path
 */
export const getDashboardRoute = (role: IUser["role"]): string => {
  return getDashboardRootPath(role);
};

/**
 * Checks if user has access to a specific dashboard feature
 * @param role - The user role
 * @param feature - The feature name
 * @returns True if user has access
 */
export const hasFeatureAccess = (
  role: IUser["role"],
  feature: "plans" | "waiting-list" | "add-plan" | "clients" | "agents" | "users" | "dashboard"
): boolean => {
  const adminFeatures = ["plans", "waiting-list", "add-plan", "clients", "agents", "users", "dashboard"];
  const salesFeatures = ["plans", "waiting-list", "add-plan", "clients", "dashboard"];
  const clientFeatures = ["plans", "waiting-list", "add-plan"];

  if (isAdminUser(role)) {
    return adminFeatures.includes(feature);
  } else if (isSalesUser(role)) {
    return salesFeatures.includes(feature);
  } else {
    return clientFeatures.includes(feature);
  }
};

export const getDashboardHomePath = (role: IUser["role"] | "client" | "sales" | "admin"): string => {
  return buildDashboardPath(role, DASHBOARD_SEGMENTS.HOME);
};
