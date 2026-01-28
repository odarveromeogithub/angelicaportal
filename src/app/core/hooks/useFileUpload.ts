import { useState, useCallback } from "react";

export interface UseFileUploadOptions {
  accept?: string;
  maxSize?: number; // in bytes
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
  validateFile?: (file: File) => Promise<boolean> | boolean;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    accept = "image/*",
    maxSize = 5 * 1024 * 1024, // 5MB default
    onSuccess,
    onError,
    validateFile,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      // Reset state
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        // Validate file type
        if (accept !== "*" && !file.type.match(accept.replace("*", ".*"))) {
          const errorMsg = `Invalid file type. Expected: ${accept}`;
          setError(errorMsg);
          onError?.(errorMsg);
          return null;
        }

        // Validate file size
        if (file.size > maxSize) {
          const errorMsg = `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`;
          setError(errorMsg);
          onError?.(errorMsg);
          return null;
        }

        // Custom validation
        if (validateFile) {
          const isValid = await validateFile(file);
          if (!isValid) {
            const errorMsg = "File validation failed";
            setError(errorMsg);
            onError?.(errorMsg);
            return null;
          }
        }

        // Read file as data URL
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              setUploadProgress((event.loaded / event.total) * 100);
            }
          };

          reader.onload = (event) => {
            const result = event.target?.result as string;
            setUploadProgress(100);
            onSuccess?.(result);
            resolve(result);
          };

          reader.onerror = () => {
            const errorMsg = "Failed to read file";
            setError(errorMsg);
            onError?.(errorMsg);
            reject(new Error(errorMsg));
          };

          reader.readAsDataURL(file);
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Upload failed";
        setError(errorMsg);
        onError?.(errorMsg);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [accept, maxSize, onSuccess, onError, validateFile],
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    reset,
    accept,
    maxSize,
  };
}
