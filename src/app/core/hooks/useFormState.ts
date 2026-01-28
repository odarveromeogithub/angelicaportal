import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface UseFormStateOptions<T> {
  validationSchema?: any;
  onSuccess?: (data: T) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useFormState<T extends Record<string, any>>(
  initialState: T,
  options: UseFormStateOptions<T> = {},
) {
  const { validationSchema, onSuccess, successMessage, errorMessage } = options;

  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(
    (field: keyof T, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const updateMultipleFields = useCallback((updates: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const fieldsToClear = Object.keys(updates) as (keyof T)[];
    setErrors((prev) => {
      const newErrors = { ...prev };
      fieldsToClear.forEach((field) => {
        if (newErrors[field]) {
          delete newErrors[field];
        }
      });
      return newErrors;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
  }, [initialState]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true;

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const validationErrors: Partial<Record<keyof T, string>> = {};
      err.inner?.forEach((error: any) => {
        validationErrors[error.path as keyof T] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  }, [formData, validationSchema]);

  const handleSubmit = useCallback(
    async (submitFn?: (data: T) => Promise<void> | void) => {
      setIsSubmitting(true);
      try {
        const isValid = await validateForm();
        if (isValid) {
          if (submitFn) {
            await submitFn(formData);
          }

          if (successMessage) {
            toast.success(successMessage);
          }

          onSuccess?.(formData);
          resetForm();
        }
      } catch (error) {
        const message =
          errorMessage ||
          (error instanceof Error ? error.message : "Operation failed");

        if (errorMessage !== null) {
          // Only show error toast if not explicitly disabled
          toast.error(message);
        }

        throw error; // Re-throw for component-level error handling
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      validateForm,
      resetForm,
      onSuccess,
      successMessage,
      errorMessage,
    ],
  );

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    updateMultipleFields,
    resetForm,
    handleSubmit,
    validateForm,
    setErrors, // For manual error setting if needed
  };
}
