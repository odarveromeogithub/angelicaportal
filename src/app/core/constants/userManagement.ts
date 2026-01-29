/**
 * Constants for User Management
 * Centralized configuration for user creation and management
 */

import type { AddUserFormData } from "@/app/core/schemas/addUser.schema";

// User Type Options for Add User Form
export const USER_TYPE_OPTIONS = [
  { value: "ADMIN", label: "Administrator" },
  { value: "SC", label: "Sales Counselor" },
];

// Area Office Options for Add User Form
export const AREA_OFFICE_OPTIONS = [
  { value: "north-luzon", label: "North Luzon" },
  { value: "metro-manila", label: "Metro Manila" },
  { value: "visayas", label: "Visayas" },
  { value: "mindanao", label: "Mindanao" },
];

// Initial form state for Add User
export const ADD_USER_INITIAL_FORM: AddUserFormData = {
  salesCounselorId: "",
  salesCounselorName: "",
  salesCounselorCode: "",
  username: "",
  contactNo: "",
  areaOffice: "",
  userType: "",
};

// Form Field Configuration for Add User Form
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
