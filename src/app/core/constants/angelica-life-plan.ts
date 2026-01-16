/**
 * Constants for Angelica Life Plan Application
 * Centralized configuration to follow DRY principle
 */

// File Upload Configuration
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = {
  "image/*": [".jpeg", ".jpg", ".png", ".gif"],
  "application/pdf": [".pdf"],
};

// Signature Pad Configuration
export const SIGNATURE_CONFIG = {
  penColor: "#000",
  backgroundColor: "#fff",
  minWidth: 1.5,
  maxWidth: 3,
  throttle: 16,
  canvasHeight: 200,
};

// Form Options
export const PLAN_TYPES = [
  { value: "Angelica Life Plan 5", label: "Angelica Life Plan 5" },
  { value: "Angelica Life Plan 10", label: "Angelica Life Plan 10" },
  { value: "Angelica Life Plan 15", label: "Angelica Life Plan 15" },
];

export const PAYMENT_MODES = [
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Annual", label: "Annual" },
];

export const PAYMENT_TERMS = [
  { value: "Installment", label: "Installment" },
  { value: "Single Premium", label: "Single Premium" },
];

export const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const CIVIL_STATUS_OPTIONS = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Widowed", label: "Widowed" },
  { value: "Separated", label: "Separated" },
  { value: "Divorced", label: "Divorced" },
];

// Contact Number Configuration
export const PHONE_CONFIG = {
  countryCode: "+63",
  maxLength: 10,
  placeholder: "9150125456",
};

// Form Steps
export const FORM_STEPS = {
  PLAN: 1,
  PLANHOLDER: 2,
  BENEFICIARY: 3,
  SUBMIT: 4,
} as const;

export const TOTAL_STEPS = 4;

// Common CSS Classes (for consistency)
export const FIELD_CLASSES = {
  wrapper: "flex flex-col gap-2",
  label: "text-xs sm:text-sm font-semibold",
  input: "h-9 sm:h-10 rounded-lg border-gray-200 text-sm",
  select: "w-full h-9 sm:h-10 rounded-lg border-gray-200 text-sm",
  button: {
    base: "rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wide",
    primary: "h-10 sm:h-11 px-6 sm:px-8 !bg-blue-600 !text-white hover:!bg-blue-700 disabled:!bg-gray-300 disabled:cursor-not-allowed",
    secondary: "h-10 sm:h-11 px-4 sm:px-8 border border-gray-300 text-gray-700 hover:bg-gray-50",
    success: "h-10 sm:h-11 px-4 sm:px-8 !bg-green-600 !text-white hover:!bg-green-700 disabled:!bg-gray-300 disabled:cursor-not-allowed",
    danger: "h-9 sm:h-10 !bg-red-600 !text-white hover:!bg-red-700",
    light: "h-10 sm:h-11 px-6 !bg-blue-100 !text-blue-600 hover:!bg-blue-200",
  },
};

// Grid Layout Classes
export const GRID_LAYOUTS = {
  threeColumns: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  fourColumns: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
  twoColumns: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
  spacing: "mb-6 sm:mb-8",
};
