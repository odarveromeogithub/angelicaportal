import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { IUser } from "../../interfaces/user.interface";
import type { AuthState } from "../types/auth";
import {
  getAccessToken,
  getVerificationCompleted,
  getMissingVerificationItems,
} from "../../helpers/auth-storage";

/**
 * Select the entire auth state
 */
export const selectAuth = (state: RootState) =>
  state.auth as unknown as AuthState;

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
  return (state.auth as unknown as AuthState).user?.data || null;
};

/**
 * Select if user is authenticated (has token and user data)
 */
export const selectIsAuthenticated = (state: RootState): boolean => {
  return (
    !!(state.auth as unknown as AuthState).user?.data && !!getAccessToken()
  );
};

/**
 * Select if user completed full verification (facial, ID, signatures)
 * Currently sourced from localStorage until backend supports it.
 */
export const selectIsFullyVerified = (): boolean => {
  return getVerificationCompleted();
};

/**
 * Select login state
 */
export const selectLoginState = (state: RootState) =>
  (state.auth as unknown as AuthState).login;

/**
 * Select if login is loading
 */
export const selectIsLoginLoading = (state: RootState): boolean => {
  return (state.auth as unknown as AuthState).login.loading;
};

/**
 * Select login error
 */
export const selectLoginError = (state: RootState): string | boolean | null => {
  return (state.auth as unknown as AuthState).login.error;
};

/**
 * Select register state
 */
export const selectRegisterState = (state: RootState) =>
  (state.auth as unknown as AuthState).register;

/**
 * Select if register is loading
 */
export const selectIsRegisterLoading = (state: RootState): boolean => {
  return (state.auth as unknown as AuthState).register.loading;
};

/**
 * Select register error
 */
export const selectRegisterError = (
  state: RootState,
): string | boolean | null => {
  return (state.auth as unknown as AuthState).register.error;
};

/**
 * Select user role
 */
export const selectUserRole = (state: RootState): IUser["role"] | null => {
  return (state.auth as unknown as AuthState).user?.data?.role || null;
};

/**
 * Select if user is admin
 */
export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === "admin" || role === "um",
);

/**
 * Select if user is sales counselor
 */
export const selectIsSales = createSelector(
  [selectUserRole],
  (role) => role === "sc",
);

/**
 * Select if user is client
 */
export const selectIsClient = createSelector(
  [selectUserRole],
  (role) => role === "client",
);

/**
 * Select missing verification items
 * Returns array of missing items: 'facial', 'id', 'signatures'
 */
export const selectMissingVerificationItems = (): string[] => {
  return getMissingVerificationItems();
};
