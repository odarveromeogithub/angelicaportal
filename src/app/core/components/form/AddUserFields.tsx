import type { Control, FieldErrors } from "react-hook-form";
import { FormField, FormSelect } from "@/app/core/components/form";
import type { AddUserFormData } from "@/app/core/schemas/addUser.schema";
import { ADD_USER_FIELD_CONFIGS } from "@/app/core/constants/userManagement";

interface AddUserFormFieldsProps {
  control: Control<AddUserFormData>;
  counselorOptions: Array<{ value: string; label: string; code?: string }>;
  loadingAgents?: boolean;
  errors?: FieldErrors<AddUserFormData>;
}

export function AddUserFormFields({
  control,
  counselorOptions,
  loadingAgents = false,
  errors,
}: AddUserFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
      {ADD_USER_FIELD_CONFIGS.map((config) => {
        const fieldOptions =
          config.name === "salesCounselorId"
            ? counselorOptions
            : config.options;

        const isSalesCounselorField = config.name === "salesCounselorId";

        if (isSalesCounselorField) {
          return (
            <FormSelect
              key={config.name}
              label={config.label}
              id={config.name}
              control={control}
              name={config.name}
              options={fieldOptions || []}
              placeholder={
                loadingAgents
                  ? "Loading sales counselors..."
                  : config.placeholder
              }
              required={config.required}
              disabled={loadingAgents}
              error={errors?.[config.name]?.message}
            />
          );
        }

        if (config.options) {
          return (
            <FormSelect
              key={config.name}
              label={config.label}
              id={config.name}
              control={control}
              name={config.name}
              options={config.options}
              placeholder={config.placeholder}
              required={config.required}
              error={errors?.[config.name]?.message}
            />
          );
        }

        return (
          <FormField
            key={config.name}
            label={config.label}
            id={config.name}
            name={config.name}
            type={config.type}
            placeholder={config.placeholder}
            required={config.required}
            disabled={config.disabled}
            registerProps={control.register(config.name)}
            error={errors?.[config.name]?.message}
          />
        );
      })}
    </div>
  );
}
