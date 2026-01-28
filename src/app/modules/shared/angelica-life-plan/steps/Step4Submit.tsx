import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/app/core/components/ui/button";
import { Label } from "@/app/core/components/ui/label";
import { Checkbox } from "@/app/core/components/ui/checkbox";
import { UploadCloud, X, CheckCircle2 } from "lucide-react";
import { useSignaturePad } from "@/app/core/hooks/useSignaturePad";
import {
  MAX_FILE_SIZE_BYTES,
  ACCEPTED_FILE_TYPES,
  FIELD_CLASSES,
} from "@/app/core/constants/angelica-life-plan";
import { cn } from "@/app/core/lib/utils";

interface Step4SubmitProps {
  onBack: () => void;
  onSubmit: (data: {
    planholder_signature: string;
    id_upload: File | null;
    agree_to_consent: boolean;
  }) => void;
  isLoading?: boolean;
}

export default function Step4Submit({
  onBack,
  onSubmit,
  isLoading = false,
}: Step4SubmitProps) {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string>("");
  const [agreeToConsent, setAgreeToConsent] = useState(false);

  const signaturePad = useSignaturePad();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (
      file &&
      (file.type.startsWith("image/") || file.type === "application/pdf")
    ) {
      if (file.size <= MAX_FILE_SIZE_BYTES) {
        setIdFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setIdPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
  });

  const clearSignature = () => {
    signaturePad.clear();
  };

  const confirmSignature = () => {
    signaturePad.saveSignature(() => {
      // Signature confirmed callback if needed
    });
  };

  const isComplete = signaturePad.signatureImage && idFile && agreeToConsent;
  const handleSubmit = () => {
    if (isComplete) {
      onSubmit({
        planholder_signature: signaturePad.signatureImage || "",
        id_upload: idFile,
        agree_to_consent: agreeToConsent,
      });
    }
  };

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
              signaturePad.signatureImage
                ? "border-emerald-500"
                : "border-slate-200 dark:border-slate-800",
            )}
          >
            <canvas
              ref={signaturePad.canvasRef}
              className={cn(
                "w-full block bg-white dark:bg-slate-900",
                signaturePad.signatureImage
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
                FIELD_CLASSES.button.secondary,
                "flex-1 sm:flex-none",
              )}
              aria-label="Clear signature"
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={confirmSignature}
              className={cn(
                FIELD_CLASSES.button.primary,
                "flex-1 sm:flex-none",
              )}
              aria-label="Confirm signature"
            >
              {signaturePad.signatureImage
                ? "✓ Signature Confirmed"
                : "Confirm Signature"}
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
                    {idFile?.type.startsWith("image/") ? (
                      <img
                        src={idPreview}
                        alt="ID Preview"
                        className="max-h-48 sm:max-h-64 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-48 sm:h-64 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          File: {idFile?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdFile(null);
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
            <Checkbox
              id="consent"
              checked={agreeToConsent}
              onCheckedChange={(checked) =>
                setAgreeToConsent(checked as boolean)
              }
              className="mt-1 flex-shrink-0"
            />
            <Label
              htmlFor="consent"
              className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              I agree to the E-Signature and Data Privacy Consent.
            </Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className={cn(
            FIELD_CLASSES.button.base,
            FIELD_CLASSES.button.secondary,
            "flex-1 sm:flex-none",
          )}
          aria-label="Go back to previous step"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isComplete || isLoading}
          className={cn(
            FIELD_CLASSES.button.base,
            FIELD_CLASSES.button.success,
            "flex-1 sm:flex-none",
          )}
          aria-label="Submit form"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
