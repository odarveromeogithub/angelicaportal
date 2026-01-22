import * as yup from "yup";

/**
 * Generic API response schemas for runtime validation of backend responses
 * Use these to validate all external/untrusted data from the API
 */

// Generic paginated response schema
export const paginatedResponseSchema = yup.object().shape({
  success: yup.boolean().required(),
  data: yup.array().required(),
  pagination: yup
    .object()
    .shape({
      total: yup.number().required(),
      per_page: yup.number().required(),
      current_page: yup.number().required(),
      last_page: yup.number().required(),
    })
    .notRequired(),
});

// Generic error response schema
export const errorResponseSchema = yup.object().shape({
  success: yup.boolean().oneOf([false]).required(),
  error: yup.string().required(),
  message: yup.string().notRequired(),
  details: yup.object().notRequired(),
  code: yup.number().notRequired(),
});

// Generic success response schema
export const successResponseSchema = yup.object().shape({
  success: yup.boolean().oneOf([true]).required(),
  message: yup.string().notRequired(),
  data: yup.mixed().notRequired(),
});

// User list response (for dashboard)
export const userListResponseSchema = yup.object().shape({
  success: yup.boolean().required(),
  data: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        name: yup.string().required(),
        email: yup.string().email().required(),
        role: yup.string().oneOf(["admin", "client", "sc", "um"]).required(),
        is_active: yup.boolean().required(),
        created_at: yup.string().notRequired(),
      })
    )
    .required(),
});

// Plan response schema (for angelica life plan API)
export const planResponseSchema = yup.object().shape({
  success: yup.boolean().required(),
  message: yup.string().required(),
  data: yup
    .object()
    .shape({
      planId: yup.string().required(),
      status: yup
        .string()
        .oneOf(["draft", "submitted", "approved", "rejected"])
        .required(),
      createdAt: yup.string().required(),
      updatedAt: yup.string().required(),
    })
    .notRequired(),
});

// Type exports
export type PaginatedResponseSchema = yup.InferType<
  typeof paginatedResponseSchema
>;
export type ErrorResponseSchema = yup.InferType<typeof errorResponseSchema>;
export type SuccessResponseSchema = yup.InferType<
  typeof successResponseSchema
>;
export type UserListResponseSchema = yup.InferType<
  typeof userListResponseSchema
>;
export type PlanResponseSchema = yup.InferType<typeof planResponseSchema>;
