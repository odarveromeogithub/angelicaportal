import { useEffect, useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AddUserFormFields } from "@/app/core/components/form";
import { FormDialog } from "@/app/core/components/ui/form-dialog";
import type { Agent } from "@/app/core/interfaces/dashboard.interface";
import {
  addUserSchema,
  type AddUserFormData,
} from "@/app/core/schemas/addUser.schema";
import { ADD_USER_INITIAL_FORM } from "@/app/core/constants/userManagement";
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
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: yupResolver(addUserSchema) as any,
    mode: "onChange",
    defaultValues: ADD_USER_INITIAL_FORM,
  });

  const form = watch();

  const isFormDirty = useMemo(() => {
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

  const isFormValid = useMemo(() => {
    return (
      Object.keys(errors).length === 0 &&
      form.salesCounselorName?.trim() !== "" &&
      form.salesCounselorCode?.trim() !== "" &&
      form.username?.trim() !== "" &&
      form.userType !== "" &&
      form.areaOffice?.trim() !== ""
    );
  }, [form, errors]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: AddUserFormData) => {
    if (savingUser) return;

    await createUser({
      username: data.username?.trim(),
      name: data.salesCounselorName?.trim(),
      agentCode: data.salesCounselorCode?.trim(),
      userType: data.userType || undefined,
      contactNo: data.contactNo?.trim() || undefined,
    }).unwrap();

    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New User"
      description="Assign a login for a sales counselor and set their user type."
      icon={<ShieldCheck className="w-6 h-6" />}
      submitLabel="Create User"
      isSubmitting={savingUser}
      isValid={isFormValid}
      isDirty={isFormDirty}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AddUserFormFields
        control={control}
        counselorOptions={counselorOptions}
        loadingAgents={loadingAgents}
        errors={errors}
      />
    </FormDialog>
  );
}
