import { useCallback, useMemo } from "react";
import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

export const useToast = () => {
  const success = useCallback((message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  }, []);

  const error = useCallback((message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 4000,
    });
  }, []);

  const info = useCallback((message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  }, []);

  const warning = useCallback((message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  }, []);

  const loading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const promise = useCallback(
    <T>(
      promiseToHandle: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      },
    ) => {
      return toast.promise(promiseToHandle, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      });
    },
    [],
  );

  return useMemo(
    () => ({ success, error, info, warning, loading, promise }),
    [success, error, info, warning, loading, promise],
  );
};
