/**
 * Auth Selectors Index
 * Central export point for all auth-related selectors
 */

export {
  selectAuth,
  selectAuthUser,
  selectIsAuthenticated,
  selectLoginState,
  selectIsLoginLoading,
  selectLoginError,
  selectRegisterState,
  selectIsRegisterLoading,
  selectRegisterError,
  selectUserRole,
  selectDashboardUser,
  selectIsAdmin,
  selectIsSales,
  selectIsClient,
} from './auth.selector';
