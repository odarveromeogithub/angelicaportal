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
// Matches IUserRegisterRequest interface - user info collection before OTP
// Conditional validation: 
// - If area is Luzon, Visayas, or Mindanao: contact_no is required, email is optional
// - If area is Other (abroad): email is required, contact_no is optional
export const registerSchema = yup.object().shape({
  area: yup
    .string()
    .required("Please select an area"),
  email: yup
    .string()
    .transform((value) => value || undefined)
    .email("Please enter a valid email address (e.g., user@example.com)")
    .when("area", {
      is: "Other",
      then: (schema) => schema.required("Email is required for international registration"),
      otherwise: (schema) => schema.optional(),
    }),
  first_name: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")
    .required("First name is required"),
  middle_name: yup
    .string()
    .matches(/^[a-zA-Z\s]*$/, "Middle name must contain only letters")
    .optional(),
  last_name: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name must contain only letters")
    .required("Last name is required"),
  contact_no: yup
    .string()
    .when("area", {
      is: (val: string) => val === "Luzon" || val === "Visayas" || val === "Mindanao",
      then: (schema) => schema
        .length(10, "Contact number must be exactly 10 digits")
        .matches(/^\d{10}$/, "Contact number must contain only digits (without the 0)")
        .required("Contact number is required for Philippines registration"),
      otherwise: (schema) => schema.optional(),
    }),
  country_code: yup.string().optional(),
  username: yup.string().optional(),
  gender: yup.string().optional(),
  birthdate: yup.string().optional(),
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
