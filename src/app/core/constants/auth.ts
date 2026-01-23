/**
 * Constants for Authentication Modules
 * Centralized configuration for login, register, and OTP
 */

// Area/Region Options
export const AREA_OPTIONS = [
  { value: "Luzon", label: "Luzon" },
  { value: "Visayas", label: "Visayas" },
  { value: "Mindanao", label: "Mindanao" },
  { value: "Other", label: "Other (Abroad)" },
];

// Country Codes for Phone Input
export const COUNTRY_CODES = [
  { value: "+63", label: "🇵🇭 +63", country: "Philippines" },
  { value: "+1", label: "🇺🇸 +1", country: "USA/Canada" },
  { value: "+44", label: "🇬🇧 +44", country: "UK" },
  { value: "+61", label: "🇦🇺 +61", country: "Australia" },
  { value: "+65", label: "🇸🇬 +65", country: "Singapore" },
  { value: "+60", label: "🇲🇾 +60", country: "Malaysia" },
  { value: "+66", label: "🇹🇭 +66", country: "Thailand" },
  { value: "+81", label: "🇯🇵 +81", country: "Japan" },
  { value: "+82", label: "🇰🇷 +82", country: "South Korea" },
  { value: "+86", label: "🇨🇳 +86", country: "China" },
  { value: "+971", label: "🇦🇪 +971", country: "UAE" },
  { value: "+966", label: "🇸🇦 +966", country: "Saudi Arabia" },
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

// Common CSS Classes for Auth - Enhanced Responsive Design
export const AUTH_CLASSES = {
  container: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-2 sm:px-3 md:px-4 lg:px-6 py-6 sm:py-8 md:py-10 lg:py-12",
  card: "w-full max-w-md rounded-2xl sm:rounded-3xl border border-blue-100 bg-white/95 shadow-lg md:shadow-xl",
  input: "h-9 sm:h-10 md:h-11 lg:h-12 rounded-lg sm:rounded-xl border-gray-200 focus-visible:ring-blue-500 text-xs sm:text-sm md:text-base w-full",
  label: "text-xs sm:text-sm md:text-base font-semibold text-gray-700",
  button: {
    primary: "h-10 sm:h-11 md:h-12 w-full rounded-full !bg-[#0d6efd] text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-[#0b5ed7] active:!bg-[#0a58ca] disabled:!bg-[#0d6efd]/60 disabled:cursor-not-allowed",
    secondary: "h-auto p-0 text-xs sm:text-sm text-blue-500 hover:bg-transparent hover:text-blue-600 transition",
    outline: "h-10 sm:h-11 md:h-12 rounded-full border border-blue-200 text-xs sm:text-sm md:text-base text-blue-600 hover:bg-blue-50 font-semibold transition",
    dark: "h-10 sm:h-11 md:h-12 w-full rounded-full !bg-black text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-black/90 active:!bg-black/80 disabled:!bg-black/60",
    yellow: "h-10 sm:h-11 md:h-12 w-full rounded-full border-0 !bg-[#f5b400] text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-[#dba100] active:!bg-[#c29000] disabled:!bg-[#f5b400]/60",
    ghost: "h-10 sm:h-11 md:h-12 w-full rounded-full !bg-[#0d6efd] text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide !text-white shadow-md transition hover:!bg-[#0b5ed7] active:!bg-[#0a58ca] disabled:!bg-[#0d6efd]/60",
  },
  phoneWrapper: "flex h-10 sm:h-11 md:h-12 items-center rounded-lg sm:rounded-xl border border-gray-200 bg-white px-2 sm:px-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 transition",
  phonePrefix: "text-xs sm:text-sm font-semibold text-gray-600 mr-1 sm:mr-2 flex-shrink-0",
  phoneInput: "flex-1 outline-none text-xs sm:text-sm md:text-base",
  otpInput: "h-11 sm:h-12 md:h-14 w-10 sm:w-11 md:w-14 rounded-lg sm:rounded-xl border-2 border-gray-300 text-center text-base sm:text-lg md:text-xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition",
  error: "text-xs sm:text-sm text-red-600",
  success: "text-xs sm:text-sm text-green-600",
  link: "text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline font-semibold transition",
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
