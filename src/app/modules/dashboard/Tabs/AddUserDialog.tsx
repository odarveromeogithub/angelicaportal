import { useEffect, useMemo } from "react";
import { ShieldCheck } from "lucide-react";

import { AddUserFormFields } from "@/app/core/components/form";
import { FormDialog } from "@/app/core/components/ui/form-dialog";
import type { Agent } from "@/app/core/interfaces/dashboard.interface";
import {
  addUserSchema,
  type AddUserFormData,
} from "@/app/core/schemas/add-user.schema";
import { ADD_USER_INITIAL_FORM } from "@/app/core/constants/user-management";
import { useFormState } from "@/app/core/hooks/useFormState";
import { dashboardApi } from "@/app/core/state/api";

type AddUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const { data: agents = [], isLoading: loadingAgents } =
    dashboardApi.useGetAgentsQuery();
  const [createUser, { isLoading: savingUser }] =
    dashboardApi.useCreateUserMutation();

  const {
    formData: form,
    errors: validationErrors,
    isSubmitting,
    updateField,
    updateMultipleFields,
    resetForm,
    handleSubmit: submitForm,
  } = useFormState<AddUserFormData>(ADD_USER_INITIAL_FORM, {
    validationSchema: addUserSchema,
    successMessage: "User created successfully!",
    onSuccess: () => onOpenChange(false),
  });

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(ADD_USER_INITIAL_FORM);
  }, [form]);

  const counselorOptions = useMemo(
    () =>
      (agents as Agent[]).map((agent) => ({
        value: agent.id,
        label: agent.name,
        code: agent.salesCounselorCode,
      })),
    [agents],
  );

  const handleAgentChange = (agentId: string) => {
    const selected = counselorOptions.find(
      (option) => option.value === agentId,
    );

    updateMultipleFields({
      salesCounselorId: agentId,
      salesCounselorName: selected?.label ?? "",
      salesCounselorCode: selected?.code ?? "",
      username:
        form.username ||
        (selected ? selected.label.toLowerCase().replace(/\s+/g, ".") : ""),
    });
  };

  const handleChange = (field: keyof AddUserFormData, value: string) => {
    updateField(field, value);
  };

  const isValid = useMemo(() => {
    return (
      Object.keys(validationErrors).length === 0 &&
      form.salesCounselorName.trim() !== "" &&
      form.salesCounselorCode.trim() !== "" &&
      form.username.trim() !== "" &&
      form.userType !== "" &&
      form.areaOffice.trim() !== ""
    );
  }, [form, validationErrors]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (savingUser) return;

    await submitForm(async () => {
      await createUser({
        username: form.username.trim(),
        name: form.salesCounselorName.trim(),
        agentCode: form.salesCounselorCode.trim(),
        userType: form.userType || undefined,
        contactNo: form.contactNo?.trim() || undefined,
      }).unwrap();
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New User"
      description="Assign a login for a sales counselor and set their user type."
      icon={<ShieldCheck className="w-6 h-6" />}
      submitLabel="Create User"
      isSubmitting={isSubmitting || savingUser}
      isValid={isValid}
      isDirty={isDirty}
      onSubmit={onFormSubmit}
    >
      <AddUserFormFields
        form={form}
        counselorOptions={counselorOptions}
        onAgentChange={handleAgentChange}
        onChange={handleChange}
        loadingAgents={loadingAgents}
      />
    </FormDialog>
  );
}
