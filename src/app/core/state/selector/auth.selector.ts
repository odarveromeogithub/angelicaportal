import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { IUser } from "../../interfaces/user.interface";
import { convertUserToDashboardUser } from "../../helpers/auth.helper";
import { getAccessToken } from "../../helpers/auth-storage";

/**
 * Select the entire auth state
 */
export const selectAuth = (state: RootState) => state.auth;

/**
 * Select access token from localStorage
 */
export const selectAccessToken = (): string | null => {
  return getAccessToken();
};

/**
 * Select the authenticated user
 */
export const selectAuthUser = (state: RootState): IUser | null => {
  return state.auth.user?.data || null;
};

/**
 * Select if user is authenticated (has token and user data)
 */
export const selectIsAuthenticated = (state: RootState): boolean => {
  return !!state.auth.user?.data && !!getAccessToken();
};

/**
 * Select login state
 */
export const selectLoginState = (state: RootState) => state.auth.login;

/**
 * Select if login is loading
 */
export const selectIsLoginLoading = (state: RootState): boolean => {
  return state.auth.login.loading;
};

/**
 * Select login error
 */
export const selectLoginError = (state: RootState): string | boolean | null => {
  return state.auth.login.error;
};

/**
 * Select register state
 */
export const selectRegisterState = (state: RootState) => state.auth.register;

/**
 * Select if register is loading
 */
export const selectIsRegisterLoading = (state: RootState): boolean => {
  return state.auth.register.loading;
};

/**
 * Select register error
 */
export const selectRegisterError = (state: RootState): string | boolean | null => {
  return state.auth.register.error;
};

/**
 * Select user role
 */
export const selectUserRole = (state: RootState): IUser["role"] | null => {
  return state.auth.user?.data?.role || null;
};

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
 * Select if user is admin
 */
export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === "admin" || role === "um"
);

/**
 * Select if user is sales counselor
 */
export const selectIsSales = createSelector(
  [selectUserRole],
  (role) => role === "sc"
);

/**
 * Select if user is client
 */
export const selectIsClient = createSelector(
  [selectUserRole],
  (role) => role === "client"
);
