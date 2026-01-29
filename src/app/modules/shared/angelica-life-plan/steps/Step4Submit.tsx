import { useState, useCallback, useEffect, useRef } from "react";
import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import SignaturePad from "signature_pad";
import type { IAngelicaLifePlanFormData } from "@/app/core/interfaces/angelicaLifePlan.interface";
import { Button } from "@/app/core/components/ui/button";
import { Label } from "@/app/core/components/ui/label";
import { Checkbox } from "@/app/core/components/ui/checkbox";
import { UploadCloud, X, CheckCircle2 } from "lucide-react";
import {
  MAX_FILE_SIZE_BYTES,
  ACCEPTED_FILE_TYPES,
  FIELD_CLASSES,
} from "@/app/core/constants/angelicaLifePlan";
import { cn } from "@/app/core/lib/utils";

interface Step4SubmitProps {
  control: Control<IAngelicaLifePlanFormData>;
  errors: FieldErrors<IAngelicaLifePlanFormData>;
  setValue: UseFormSetValue<IAngelicaLifePlanFormData>;
  onBack: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  showNavigation?: boolean;
  customFieldClasses?: typeof FIELD_CLASSES;
}

export default function Step4Submit({
  control,
  errors,
  setValue,
  onBack,
  onSubmit,
  isLoading = false,
  showNavigation = true,
  customFieldClasses,
}: Step4SubmitProps) {
  // Use custom classes if provided, otherwise use defaults
  const fieldClasses = customFieldClasses || FIELD_CLASSES;
  const [idPreview, setIdPreview] = useState<string>("");
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  // Initialize signature pad when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canvasRef.current) {
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

        // Initialize SignaturePad
        const signaturePad = new SignaturePad(canvasRef.current, {
          penColor: "#000",
          backgroundColor: "#fff",
          minWidth: 1.5,
          maxWidth: 3,
          throttle: 16,
        });

        // Store signature pad instance
        signaturePadRef.current = signaturePad;

        signaturePad.addEventListener("beginStroke", () => {
          setHasSignature(false); // Reset confirmed state when drawing starts
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Watch form values for completion check
  const watchedValues = useWatch({
    control,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (
        file &&
        (file.type.startsWith("image/") || file.type === "application/pdf")
      ) {
        if (file.size <= MAX_FILE_SIZE_BYTES) {
          // Update the form field
          setValue("id_upload", file);
          const reader = new FileReader();
          reader.onload = (event) => {
            setIdPreview(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
  });

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
    setValue("planholder_signature", "");
    setHasSignature(false);
  };

  const confirmSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const imageData = signaturePadRef.current.toDataURL("image/png");
      setValue("planholder_signature", imageData);
      setHasSignature(true);
    }
  };

  const isComplete =
    watchedValues.planholder_signature &&
    watchedValues.id_upload &&
    watchedValues.agree_to_consent &&
    !errors.planholder_signature &&
    !errors.id_upload &&
    !errors.agree_to_consent;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
            Planholder Signature
          </h2>
          <div
            className={cn(
              "border-2 rounded-lg bg-white dark:bg-slate-900 overflow-hidden",
              hasSignature
                ? "border-emerald-500"
                : "border-slate-200 dark:border-slate-800",
            )}
          >
            <canvas
              ref={canvasRef}
              className={cn(
                "w-full block bg-white dark:bg-slate-900",
                hasSignature
                  ? "cursor-not-allowed opacity-90 pointer-events-none"
                  : "cursor-crosshair touch-none",
              )}
              style={{ height: "200px" }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
            <Button
              type="button"
              onClick={clearSignature}
              variant="outline"
              className={cn(
                fieldClasses.button.secondary,
                "flex-1 sm:flex-none",
              )}
              aria-label="Clear signature"
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={confirmSignature}
              className={cn(fieldClasses.button.primary, "flex-1 sm:flex-none")}
              aria-label="Confirm signature"
            >
              {hasSignature ? "✓ Signature Confirmed" : "Confirm Signature"}
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
            Upload Planholder's Valid ID with 3 Specimen Signature(Valid IDs:
            Company ID or any Government ID)
          </h2>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40"
                : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500"
            } ${idPreview ? "bg-white dark:bg-slate-900" : "bg-slate-50/70 dark:bg-slate-900/60"}`}
          >
            <input {...getInputProps()} />
            {idPreview ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="relative inline-block">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="size-8 sm:size-10 text-green-600" />
                    {control._formValues.id_upload?.type.startsWith(
                      "image/",
                    ) ? (
                      <img
                        src={idPreview}
                        alt="ID Preview"
                        className="max-h-48 sm:max-h-64 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-48 sm:h-64 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          File: {(control._formValues.id_upload as File)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("id_upload", null);
                    setIdPreview("");
                  }}
                  variant="destructive"
                  className="h-9 sm:h-10 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 mx-auto w-full sm:w-auto"
                >
                  <X className="size-3 sm:size-4" />
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 py-4 sm:py-6">
                <UploadCloud
                  className={`size-8 sm:size-12 mx-auto ${
                    isDragActive
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    {isDragActive
                      ? "Drop the file here"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG, GIF, PDF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
            E-Signature and Data Privacy Consent
          </h2>

          <div className="bg-slate-50/70 dark:bg-slate-900/60 rounded-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-800 mb-4 sm:mb-6 max-h-60 sm:max-h-96 overflow-y-auto">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>E-Signature and Data Privacy Consent</strong>
              <br />
              <br />
              By clicking "Submit", I hereby give my full consent to the
              collection, use, and processing of my personal information by
              CCLPI Plans for purposes related to my Life Plan application. I
              understand that my uploaded valid identification cards, specimen
              signatures, and other submitted documents will be used solely for
              identity verification, client record creation, and transaction
              validation, in compliance with Republic Act No. 10173 (Data
              Privacy Act of 2012). I also acknowledge that my digital
              submission and electronic signature, whether typed, uploaded, or
              otherwise affixed, shall have the same legal effect, validity, and
              enforceability as my handwritten signature pursuant to Republic
              Act No. 8792 (E-Commerce Act of 2000). I have read and understood
              this consent, and I freely agree to be bound by its terms.
            </p>
          </div>

          <div className="flex items-start gap-2 sm:gap-3">
            <Controller
              name="agree_to_consent"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="consent"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1 flex-shrink-0"
                />
              )}
            />
            <Label
              htmlFor="consent"
              className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              I agree to the E-Signature and Data Privacy Consent.
            </Label>
          </div>
          {errors.agree_to_consent && (
            <p className="text-xs text-red-600 mt-1">
              {errors.agree_to_consent.message}
            </p>
          )}
        </div>
      </div>

      {showNavigation && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className={cn(
              fieldClasses.button.base,
              fieldClasses.button.secondary,
              "flex-1 sm:flex-none",
            )}
            aria-label="Go back to previous step"
          >
            Back
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!isComplete || isLoading}
            className={cn(
              fieldClasses.button.base,
              fieldClasses.button.success,
              "flex-1 sm:flex-none",
            )}
            aria-label="Submit form"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      )}
    </div>
  );
}
