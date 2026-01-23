import { toast } from "sonner";

/**
 * Toast component wrapper around Sonner
 * This provides a consistent API for toast notifications across the app
 */

interface ToastProps {
  message: string;
  description?: string;
  variant?: "default" | "success" | "destructive" | "info";
  duration?: number;
}

export const Toast = {
  success: ({
    message,
    description,
    duration = 4000,
  }: Omit<ToastProps, "variant">) => {
    return toast.success(message, {
      description,
      duration,
    });
  },

  error: ({
    message,
    description,
    duration = 4000,
  }: Omit<ToastProps, "variant">) => {
    return toast.error(message, {
      description,
      duration,
    });
  },

  info: ({
    message,
    description,
    duration = 4000,
  }: Omit<ToastProps, "variant">) => {
    return toast.info(message, {
      description,
      duration,
    });
  },

  warning: ({
    message,
    description,
    duration = 4000,
  }: Omit<ToastProps, "variant">) => {
    return toast.warning(message, {
      description,
      duration,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  dismiss: (id: string | number) => {
    return toast.dismiss(id);
  },
};
