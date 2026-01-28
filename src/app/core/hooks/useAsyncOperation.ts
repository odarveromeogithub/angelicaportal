import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface UseAsyncOperationOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useAsyncOperation<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (
      operation: () => Promise<T>,
      options: UseAsyncOperationOptions<T> = {},
    ) => {
      const {
        onSuccess,
        onError,
        successMessage,
        errorMessage,
        showSuccessToast = !!successMessage,
        showErrorToast = true,
      } = options;

      setIsLoading(true);
      setError(null);

      try {
        const result = await operation();
        setData(result);

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessageText =
          err instanceof Error ? err.message : "Operation failed";
        setError(errorMessageText);

        if (showErrorToast) {
          const displayMessage = errorMessage || errorMessageText;
          toast.error(displayMessage);
        }

        onError?.(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
  };
}
