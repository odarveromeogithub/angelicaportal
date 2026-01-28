/**
 * Constants for User Management
 * Centralized configuration for user creation and management
 */

import type { AddUserFormData } from "@/app/core/schemas/add-user.schema";

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
