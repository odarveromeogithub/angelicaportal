/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const

/**
 * Route paths for primary application routes
 */
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  OTP: "/otp",
  ANGELICA_LIFE_PLAN: "/angelica",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
} as const

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = [
  APP_ROUTES.LOGIN,
  APP_ROUTES.REGISTER,
  APP_ROUTES.FORGOT_PASSWORD,
  APP_ROUTES.RESET_PASSWORD,
  APP_ROUTES.OTP,
] as const
