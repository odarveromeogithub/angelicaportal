/**
 * UI Constants
 * Centralized configuration for UI components
 */

// Sidebar Configuration
export const SIDEBAR_CONFIG = {
  COOKIE_NAME: "sidebar_state",
  COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
  WIDTH: "16rem",
  WIDTH_MOBILE: "18rem",
  WIDTH_ICON: "3rem",
  KEYBOARD_SHORTCUT: "b",
} as const;

// QR Code Configuration
export const QR_CODE_CONFIG = {
  BASE_URL: "https://api.qrserver.com/v1/create-qr-code/",
  SIZES: {
    SMALL: "320x320",
    LARGE: "500x500",
  },
} as const;

// Default User Values
export const DEFAULT_USER_VALUES = {
  EMAIL: "user@example.com",
  NAME: "User",
  PHONE: "+63 912 345 6789",
} as const;

// Referral URL Placeholder
export const REFERRAL_URL_PLACEHOLDER =
  "https://sc.cclpi.com.ph:8080/#/referral/...";
