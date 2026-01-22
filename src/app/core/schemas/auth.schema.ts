import * as yup from "yup";

// Login Schema - Request
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

// Register Schema - Request
// Matches IUserRegisterRequest interface with password fields and optional extended fields
export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address (e.g., user@example.com)"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
  first_name: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")
    .required("First name is required"),
  middle_name: yup
    .string()
    .matches(/^[a-zA-Z\s]*$/, "Middle name must contain only letters")
    .notRequired(),
  last_name: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name must contain only letters")
    .required("Last name is required"),
  contact_no: yup
    .string()
    .length(10, "Contact number must be exactly 10 digits")
    .matches(/^\d{10}$/, "Contact number must contain only digits (without the 0)")
    .required("Contact number is required"),
  area: yup
    .string()
    .required("Please select an area"),
  username: yup.string().notRequired(),
  gender: yup.string().notRequired(),
  birthdate: yup.string().notRequired(),
});

// OTP Schema - Request
export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d{6}$/, "OTP must contain only digits")
    .required("OTP is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

// Login Response Schema
export const loginResponseSchema = yup.object().shape({
  access_token: yup.string().required("Access token is required"),
  user: yup
    .object()
    .shape({
      id: yup.number().required(),
      email: yup.string().email().required(),
      name: yup.string().required(),
      role: yup.string().oneOf(["admin", "client", "sc", "um"]).required(),
    })
    .required("User data is required"),
});

// OTP Response Schema
export const otpResponseSchema = yup.object().shape({
  success: yup.boolean().required(),
  message: yup.string().required(),
  access_token: yup.string().notRequired(),
  user: yup.object().notRequired(),
});

// Type exports - Requests
export type LoginSchema = yup.InferType<typeof loginSchema>;
export type RegisterSchema = yup.InferType<typeof registerSchema>;
export type OTPSchema = yup.InferType<typeof otpSchema>;

// Type exports - Responses
export type LoginResponseSchema = yup.InferType<typeof loginResponseSchema>;
export type OTPResponseSchema = yup.InferType<typeof otpResponseSchema>;
