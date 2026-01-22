import * as yup from "yup";

/**
 * Validation helper utilities
 * Provides functions to validate and sanitize data consistently across the app
 */

/**
 * Validate data against a schema and return typed result
 * @param schema - Yup schema to validate against
 * @param data - Data to validate
 * @returns Validated and typed data
 * @throws ValidationError with detailed error messages
 */
export async function validateSchema<T>(
  schema: yup.Schema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ValidationError(
        error.message,
        formatValidationErrors(error)
      );
    }
    throw error;
  }
}

/**
 * Validate data against a schema synchronously
 * @param schema - Yup schema to validate against
 * @param data - Data to validate
 * @returns Validated and typed data
 * @throws ValidationError with detailed error messages
 */
export function validateSchemaSync<T>(
  schema: yup.Schema<T>,
  data: unknown
): T {
  try {
    return schema.validateSync(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new ValidationError(
        error.message,
        formatValidationErrors(error)
      );
    }
    throw error;
  }
}

/**
 * Check if data is valid without throwing
 * @param schema - Yup schema to validate against
 * @param data - Data to validate
 * @returns True if valid, false otherwise
 */
export async function isValid<T>(
  schema: yup.Schema<T>,
  data: unknown
): Promise<boolean> {
  return schema.isValid(data);
}

/**
 * Format Yup validation errors into a field-error map
 * @param error - Yup ValidationError
 * @returns Object mapping field paths to error messages
 */
export function formatValidationErrors(
  error: yup.ValidationError
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (error.inner && error.inner.length > 0) {
    error.inner.forEach((err) => {
      if (err.path) {
        errors[err.path] = err.message;
      }
    });
  } else if (error.path) {
    errors[error.path] = error.message;
  }

  return errors;
}

/**
 * Extract first error message from validation error
 * @param error - Yup ValidationError
 * @returns First error message
 */
export function getFirstErrorMessage(error: yup.ValidationError): string {
  if (error.inner && error.inner.length > 0) {
    return error.inner[0].message;
  }
  return error.message;
}

/**
 * Custom ValidationError class with field-specific errors
 */
export class ValidationError extends Error {
  public fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Sanitize string input (trim and remove extra whitespace)
 * @param value - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/**
 * Sanitize email input (lowercase and trim)
 * @param email - Email to sanitize
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Sanitize phone number (remove non-digits)
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number (digits only)
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Sanitize numeric string (remove non-numeric characters except decimal)
 * @param value - Value to sanitize
 * @returns Sanitized numeric string
 */
export function sanitizeNumeric(value: string): string {
  return value.replace(/[^\d.]/g, "");
}

/**
 * Parse and validate API response against schema
 * @param schema - Yup schema to validate against
 * @param response - API response data
 * @returns Validated and typed data
 * @throws ValidationError if response doesn't match schema
 */
export async function validateApiResponse<T>(
  schema: yup.Schema<T>,
  response: unknown
): Promise<T> {
  try {
    return await schema.validate(response, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error("API Response validation failed:", {
        errors: formatValidationErrors(error),
        response,
      });
      throw new ValidationError(
        "Invalid response from server",
        formatValidationErrors(error)
      );
    }
    throw error;
  }
}

/**
 * Sanitize form data object (trim all string values)
 * @param data - Form data object
 * @returns Sanitized data object
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T
): T {
  const sanitized: Record<string, unknown> = { ...data };

  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    }
  });

  return sanitized as T;
}
