import { useState } from "react";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { FormDialog } from "@/app/core/components/ui/form-dialog";
import { FormField } from "@/app/core/components/form";
import { Textarea } from "@/app/core/components/ui/textarea";
import { Label } from "@/app/core/components/ui/label";
import type { User } from "@/app/core/interfaces/dashboard.interface";

const sendEmailSchema = object({
  subject: string()
    .required("Subject is required")
    .min(3, "Subject must be at least 3 characters"),
  message: string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
});

type SendEmailFormData = {
  subject: string;
  message: string;
};

type SendEmailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export function SendEmailDialog({
  open,
  onOpenChange,
  user,
}: SendEmailDialogProps) {
  const [sending, setSending] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SendEmailFormData>({
    resolver: yupResolver(sendEmailSchema) as any,
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: SendEmailFormData) => {
    if (!user) return;

    setSending(true);
    try {
      // Mock email sending - in real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Sending email:", {
        to: user.username,
        subject: data.subject,
        message: data.message,
        user: user,
      });
      alert(`Email sent successfully to ${user.name} (${user.username})`);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Send Email"
      description={`Send an email to ${user?.name || "user"}`}
      icon={<Mail className="w-6 h-6" />}
      submitLabel="Send Email"
      isSubmitting={sending}
      isValid={Object.keys(errors).length === 0}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>To:</strong> {user?.name} ({user?.username})
          </p>
        </div>

        <FormField
          control={control}
          name="subject"
          id="subject"
          label="Subject"
          placeholder="Enter email subject"
          error={errors.subject?.message}
        />

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Enter your message"
            rows={4}
            {...register("message")}
            className={errors.message ? "border-red-500" : ""}
          />
          {errors.message && (
            <p className="text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>
      </div>
    </FormDialog>
  );
}
