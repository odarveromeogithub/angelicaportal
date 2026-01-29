import { useRef, useState, useCallback, useEffect } from "react";
import SignaturePad from "signature_pad";
import { SIGNATURE_CONFIG } from "../constants/angelicaLifePlan";

export interface UseSignaturePadOptions {
  throttle?: number;
  onSave?: (signature: string) => void;
  onClear?: () => void;
  initialSignature?: string | null;
}

export function useSignaturePad(options: UseSignaturePadOptions = {}) {
  const {
    throttle = SIGNATURE_CONFIG.throttle,
    onSave,
    onClear,
    initialSignature = null,
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [signatureImage, setSignatureImage] = useState<string | null>(
    initialSignature,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initSignaturePad = useCallback(() => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    canvasRef.current.width = rect.width * ratio;
    canvasRef.current.height = 200 * ratio;
    canvasRef.current.style.width = `${rect.width}px`;
    canvasRef.current.style.height = "200px";

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    signaturePadRef.current = new SignaturePad(canvasRef.current, {
      penColor: SIGNATURE_CONFIG.penColor,
      backgroundColor: SIGNATURE_CONFIG.backgroundColor,
      minWidth: SIGNATURE_CONFIG.minWidth,
      maxWidth: SIGNATURE_CONFIG.maxWidth,
      throttle,
    });

    signaturePadRef.current.addEventListener("beginStroke", () => {
      setIsEmpty(false);
    });
  }, [throttle]);

  const clear = useCallback(() => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
    onClear?.();
  }, [onClear]);

  const saveSignature = useCallback(
    (onSuccess?: () => void) => {
      if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
        return;
      }

      const imageData = signaturePadRef.current.toDataURL("image/png");
      setSignatureImage(imageData);
      setIsModalOpen(false);
      onSave?.(imageData);
      onSuccess?.();
    },
    [onSave],
  );

  const uploadSignature = useCallback(
    (file: File | null, onSuccess?: () => void) => {
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        setSignatureImage(imageData);
        onSave?.(imageData);
        onSuccess?.();
      };
      reader.readAsDataURL(file);
    },
    [onSave],
  );

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    // Initialize signature pad when modal opens
    setTimeout(() => {
      initSignaturePad();
    }, 100);
  }, [initSignaturePad]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    signaturePadRef.current?.clear();
    setIsEmpty(true);
  }, []);

  const setSignatureImageState = useCallback((image: string | null) => {
    setSignatureImage(image);
  }, []);

  // Handle window resize
  useEffect(() => {
    if (!isModalOpen || !canvasRef.current || !signaturePadRef.current) return;

    const resizeCanvas = () => {
      if (!canvasRef.current || !signaturePadRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);

      canvasRef.current.width = rect.width * ratio;
      canvasRef.current.height = 200 * ratio;
      canvasRef.current.style.width = `${rect.width}px`;
      canvasRef.current.style.height = "200px";

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.scale(ratio, ratio);
      }

      const data = signaturePadRef.current.toData();
      signaturePadRef.current.clear();
      signaturePadRef.current.fromData(data);
    };

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isModalOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      signaturePadRef.current?.off();
    };
  }, []);

  return {
    canvasRef,
    isEmpty,
    signatureImage,
    isModalOpen,
    initSignaturePad,
    clear,
    saveSignature,
    uploadSignature,
    openModal,
    closeModal,
    setSignatureImage: setSignatureImageState,
  };
}
