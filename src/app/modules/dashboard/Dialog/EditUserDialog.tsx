import { useEffect, useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AddUserFormFields } from "@/app/core/components/form";
import { FormDialog } from "@/app/core/components/ui/form-dialog";
import type { Agent, User } from "@/app/core/interfaces/dashboard.interface";
import {
  addUserSchema,
  type AddUserFormData,
} from "@/app/core/schemas/addUser.schema";
import { dashboardApi } from "@/app/core/state/api";

type EditUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: User | null;
};

export function EditUserDialog({
  open,
  onOpenChange,
  userData,
}: EditUserDialogProps) {
  const { data: agents = [], isLoading: loadingAgents } =
    dashboardApi.useGetAgentsQuery();
  const [updateUser, { isLoading: updatingUser }] =
    dashboardApi.useUpdateUserMutation();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: yupResolver(addUserSchema) as any,
    mode: "onChange",
    defaultValues: {
      salesCounselorName: "",
      salesCounselorCode: "",
      username: "",
      userType: "",
      contactNo: "",
      areaOffice: "",
    },
  });

  const form = watch();

  const isFormDirty = useMemo(() => {
    if (!userData) return false;
    return (
      form.salesCounselorName !== userData.name ||
      form.salesCounselorCode !== userData.agentCode ||
      form.username !== userData.username ||
      form.userType !== userData.userType ||
      form.contactNo !== userData.contactNo
    );
  }, [form, userData]);

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
    if (userData && open) {
      reset({
        salesCounselorName: userData.name,
        salesCounselorCode: userData.agentCode,
        username: userData.username,
        userType: userData.userType,
        contactNo: userData.contactNo || "",
        areaOffice: "Main Office", // Default value since it's not in User interface
      });
    }
  }, [userData, open, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: AddUserFormData) => {
    if (updatingUser || !userData) return;

    await updateUser({
      id: userData.id,
      data: {
        username: data.username?.trim(),
        name: data.salesCounselorName?.trim(),
        agentCode: data.salesCounselorCode?.trim(),
        userType: data.userType || undefined,
        contactNo: data.contactNo?.trim() || undefined,
      },
    }).unwrap();

    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit User"
      description="Update user information and permissions."
      icon={<ShieldCheck className="w-6 h-6" />}
      submitLabel="Update User"
      isSubmitting={updatingUser}
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
