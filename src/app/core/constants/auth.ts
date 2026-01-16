/**
 * Constants for Authentication Modules
 * Centralized configuration for login, register, and OTP
 */

// Area/Region Options
export const AREA_OPTIONS = [
  { value: "Mindanao 1", label: "Mindanao 1" },
  { value: "Mindanao 2", label: "Mindanao 2" },
  { value: "Visayas", label: "Visayas" },
  { value: "Luzon", label: "Luzon" },
  { value: "NCR", label: "NCR (National Capital Region)" },
];

// Phone Configuration
export const AUTH_PHONE_CONFIG = {
  countryCode: "+63",
  maxLength: 10,
  placeholder: "9150125456",
  regex: /^\d{10}$/,
};

// Validation Rules
export const VALIDATION_RULES = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    minLength: 5,
    message: "Please enter a valid email address (e.g., user@example.com)",
  },
  firstName: {
    regex: /^[a-zA-Z\s]*$/,
    minLength: 2,
    message: "First name must be at least 2 characters (letters only)",
  },
  lastName: {
    regex: /^[a-zA-Z\s]*$/,
    minLength: 2,
    message: "Last name must be at least 2 characters (letters only)",
  },
  middleName: {
    regex: /^[a-zA-Z\s]*$/,
    optional: true,
  },
  contactNumber: {
    regex: /^\d{10}$/,
    message: "Contact number must be exactly 10 digits (numbers only, without the 0)",
  },
  password: {
    minLength: 8,
    message: "Password must be at least 8 characters",
  },
  otp: {
    length: 6,
    regex: /^\d{6}$/,
    message: "OTP must be exactly 6 digits",
  },
};

// OTP Configuration
export const OTP_CONFIG = {
  length: 6,
  expiryMinutes: 10,
  resendDelaySeconds: 60,
  maxAttempts: 3,
} as const

// Common CSS Classes for Auth
export const AUTH_CLASSES = {
  container: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10",
  card: "rounded-[32px] border border-blue-100 bg-white/95 shadow-[0_28px_70px_-40px_rgba(14,66,120,0.5)]",
  input: "h-11 rounded-xl border-gray-200 focus-visible:ring-blue-500 text-sm",
  label: "text-sm font-medium text-gray-700",
  button: {
    primary: "mt-2 h-12 w-full rounded-full !bg-[#0d6efd] text-sm font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-[#0b5ed7] disabled:!bg-[#0d6efd]/60 disabled:cursor-not-allowed",
    secondary: "h-auto p-0 text-blue-500 hover:bg-transparent hover:text-blue-600",
    outline: "flex-1 h-10 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50",
    dark: "h-12 w-full rounded-full !bg-black text-sm font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-black/90 disabled:!bg-black/60",
    yellow: "h-12 w-full rounded-full border-0 !bg-[#f5b400] text-sm font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-[#dba100]",
    ghost: "h-12 w-full rounded-full !bg-[#0d6efd] text-sm font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-[#0b5ed7] disabled:!bg-[#0d6efd]/60",
  },
  phoneWrapper: "flex h-11 items-center rounded-xl border border-gray-200 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
  phonePrefix: "text-sm font-medium text-gray-600 mr-2",
  phoneInput: "flex-1 outline-none text-sm",
  otpInput: "h-12 w-12 sm:h-14 sm:w-14 rounded-xl border-2 border-gray-300 text-center text-lg sm:text-xl font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  error: "text-sm text-red-600",
  success: "text-sm text-green-600",
  link: "text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium",
};

// Toast Messages
export const AUTH_MESSAGES = {
  login: {
    success: "Login successful! Redirecting...",
    error: "Invalid email or password. Please try again.",
    loading: "Logging in...",
  },
  register: {
    success: "Registration OTP sent! Check your email.",
    error: "Registration failed. Please try again.",
    loading: "Processing registration...",
  },
  otp: {
    success: "OTP verified successfully!",
    error: "Invalid OTP. Please try again.",
    expired: "OTP has expired. Please request a new one.",
    resent: "New OTP sent to your email!",
    wrongAttempt: "Wrong OTP.",
    maxAttempts: "Too many wrong attempts. Returning to register.",
    loading: "Verifying OTP...",
  },
};
