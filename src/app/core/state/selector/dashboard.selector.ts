import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { selectAuthUser } from "./auth.selector";
import { convertUserToDashboardUser } from "../../helpers/auth.helper";

/**
 * Dashboard User Selectors
 */

/**
 * Select dashboard user (converted from auth user)
 * This replaces the need for a separate dashboard_user slice
 */
export const selectDashboardUser = createSelector(
  [selectAuthUser],
  (user) => {
    if (!user) return null;
    return convertUserToDashboardUser(user);
  }
);

/**
 * Plans Selectors
 */

export const selectPlans = (state: RootState) => state.dashboard_plans.plans;
export const selectFilteredPlans = (state: RootState) => state.dashboard_plans.filteredPlans;
export const selectPlansLoading = (state: RootState) => state.dashboard_plans.loading;
export const selectPlansError = (state: RootState) => state.dashboard_plans.error;
export const selectPlansSearchQuery = (state: RootState) => state.dashboard_plans.searchQuery;
export const selectPlansStatusFilter = (state: RootState) => state.dashboard_plans.statusFilter;

/**
 * Waiting List Selectors
 */

export const selectWaitingList = (state: RootState) => state.dashboard_waitingList.items;
export const selectFilteredWaitingList = (state: RootState) => state.dashboard_waitingList.filteredItems;
export const selectWaitingListLoading = (state: RootState) => state.dashboard_waitingList.loading;
export const selectWaitingListError = (state: RootState) => state.dashboard_waitingList.error;
export const selectWaitingListSearchQuery = (state: RootState) => state.dashboard_waitingList.searchQuery;

/**
 * Client List Selectors
 */

export const selectClients = (state: RootState) => state.dashboard_clientList.items;
export const selectFilteredClients = (state: RootState) => state.dashboard_clientList.filteredItems;
export const selectClientsLoading = (state: RootState) => state.dashboard_clientList.loading;
export const selectClientsSearchQuery = (state: RootState) => state.dashboard_clientList.searchQuery;
export const selectClientsStatusFilter = (state: RootState) => state.dashboard_clientList.statusFilter;

/**
 * Agent List Selectors
 */

export const selectAgents = (state: RootState) => state.dashboard_agentList.agents;
export const selectAgentsLoading = (state: RootState) => state.dashboard_agentList.loading;
export const selectAgentsError = (state: RootState) => state.dashboard_agentList.error;
export const selectAgentsSearchQuery = (state: RootState) => state.dashboard_agentList.searchQuery;

/**
 * Users List Selectors
 */

export const selectUsers = (state: RootState) => state.dashboard_usersList.users;
export const selectUsersLoading = (state: RootState) => state.dashboard_usersList.loading;
export const selectUsersError = (state: RootState) => state.dashboard_usersList.error;
export const selectUsersSearchQuery = (state: RootState) => state.dashboard_usersList.searchQuery;
