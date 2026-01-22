/**
 * Services Index
 * Central export point for all service modules
 */

// Auth services
export * from "./auth/auth.service";

// Dashboard services
export { dashboardApi } from "./dashboard/plan.service";
export { waitingListApi } from "./dashboard/waiting-list.service";
export { clientListApi } from "./dashboard/client-list.service";
export { agentListApi } from "./dashboard/agent-list.service";
export { usersListApi } from "./dashboard/users-list.service";

// Angelica Life Plan service
export { angelicaLifePlanService } from "./angelica-life-plan/angelica-life-plan.service";
