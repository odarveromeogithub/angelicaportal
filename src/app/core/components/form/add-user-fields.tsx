import { FormField, FormSelect } from "@/app/core/components/form";
import type { AddUserFormData } from "@/app/core/schemas/add-user.schema";
import {
  AREA_OFFICE_OPTIONS,
  USER_TYPE_OPTIONS,
} from "@/app/core/constants/user-management";

export interface FormFieldConfig {
  name: keyof AddUserFormData;
  label: string;
  type?: "text" | "email" | "number" | "tel" | "password";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export const ADD_USER_FIELD_CONFIGS: FormFieldConfig[] = [
  {
    name: "salesCounselorId",
    label: "Sales Counselor",
    placeholder: "Select Sales Counselor",
    required: true,
  },
  {
    name: "salesCounselorCode",
    label: "Sales Counselor Code",
    placeholder: "e.g., SC-001",
    required: true,
  },
  {
    name: "username",
    label: "Username",
    placeholder: "username",
    required: true,
  },
  {
    name: "contactNo",
    label: "Contact Number",
    type: "tel",
    placeholder: "e.g., +63 912 345 6789",
  },
  {
    name: "areaOffice",
    label: "Area Office",
    placeholder: "Select Area Office",
    required: true,
    options: AREA_OFFICE_OPTIONS,
  },
  {
    name: "userType",
    label: "User Type",
    placeholder: "Select User Type",
    required: true,
    options: USER_TYPE_OPTIONS,
  },
];

interface AddUserFormFieldsProps {
  form: AddUserFormData;
  counselorOptions: Array<{ value: string; label: string; code?: string }>;
  onAgentChange: (agentId: string) => void;
  onChange: (field: keyof AddUserFormData, value: string) => void;
  loadingAgents?: boolean;
}

export function AddUserFormFields({
  form,
  counselorOptions,
  onAgentChange,
  onChange,
  loadingAgents = false,
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
              value={form[config.name] as string}
              onValueChange={onAgentChange}
              options={fieldOptions || []}
              placeholder={
                loadingAgents
                  ? "Loading sales counselors..."
                  : config.placeholder
              }
              required={config.required}
              disabled={loadingAgents}
            />
          );
        }

        if (config.options) {
          return (
            <FormSelect
              key={config.name}
              label={config.label}
              id={config.name}
              value={form[config.name] as string}
              onValueChange={(value) => onChange(config.name, value)}
              options={config.options}
              placeholder={config.placeholder}
              required={config.required}
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
            value={form[config.name] as string}
            onChange={(e) => onChange(config.name, e.target.value)}
            placeholder={config.placeholder}
            required={config.required}
            disabled={config.disabled}
          />
        );
      })}
    </div>
  );
}
