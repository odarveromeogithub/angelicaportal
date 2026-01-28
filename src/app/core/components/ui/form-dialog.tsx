import React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/app/core/components/ui/button";
import { ConfirmDialog } from "@/app/core/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/core/components/ui/dialog";
import { cn } from "@/app/core/lib/utils";

export interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  isValid?: boolean;
  isDirty?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  isValid = true,
  isDirty = false,
  onSubmit,
  className,
}: FormDialogProps) {
  const [showConfirmCancel, setShowConfirmCancel] = React.useState(false);

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmCancel(true);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn("p-0 overflow-hidden sm:max-w-3xl", className)}
          showCloseButton={false}
        >
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-5 sm:px-7 sm:py-6 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.12em] text-white/70">
                Form
              </p>
              <DialogHeader className="p-0">
                <DialogTitle className="text-2xl font-semibold text-white">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-white/80">
                  {description}
                </DialogDescription>
              </DialogHeader>
            </div>
            {icon && (
              <div className="bg-white/10 border border-white/20 rounded-lg p-2.5 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="p-6 sm:p-7 space-y-6">
            {children}

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="shadow-sm"
                onClick={handleCancel}
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                className="gap-2 shadow-md"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {isSubmitting ? "Saving..." : submitLabel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Cancel Changes?"
        description="Are you sure you want to cancel? Any unsaved changes will be lost."
        confirmText="Yes, Cancel"
        cancelText="No, Continue"
        onConfirm={() => onOpenChange(false)}
        onCancel={() => setShowConfirmCancel(false)}
      />
    </>
  );
}
