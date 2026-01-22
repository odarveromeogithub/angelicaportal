import * as yup from "yup";

/**
 * Profile and Settings form schemas
 * Validates user profile updates and settings changes
 */

// Profile update schema
export const profileUpdateSchema = yup.object().shape({
  first_name: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")
    .notRequired(),
  middle_name: yup
    .string()
    .matches(/^[a-zA-Z\s]*$/, "Middle name must contain only letters")
    .notRequired(),
  last_name: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name must contain only letters")
    .notRequired(),
  email: yup.string().email("Invalid email address").notRequired(),
  contact_no: yup
    .string()
    .length(10, "Contact number must be exactly 10 digits")
    .matches(/^\d{10}$/, "Contact number must contain only digits")
    .notRequired(),
  gender: yup.string().notRequired(),
  birthdate: yup.string().notRequired(),
});

// Password change schema
export const passwordChangeSchema = yup.object().shape({
  current_password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Current password is required"),
  new_password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required("Password confirmation is required"),
});

// Settings update schema (email notifications, preferences)
export const settingsUpdateSchema = yup.object().shape({
  email_notifications: yup.boolean().notRequired(),
  sms_notifications: yup.boolean().notRequired(),
  two_factor_enabled: yup.boolean().notRequired(),
  theme: yup
    .string()
    .oneOf(["light", "dark", "auto"])
    .notRequired(),
  language: yup.string().notRequired(),
  timezone: yup.string().notRequired(),
});

// Type exports
export type ProfileUpdateSchema = yup.InferType<typeof profileUpdateSchema>;
export type PasswordChangeSchema = yup.InferType<typeof passwordChangeSchema>;
export type SettingsUpdateSchema = yup.InferType<typeof settingsUpdateSchema>;
