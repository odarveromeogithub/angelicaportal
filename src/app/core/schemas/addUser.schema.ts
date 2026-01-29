import * as yup from "yup";

export const addUserSchema = yup.object().shape({
  salesCounselorId: yup.string().required("Sales counselor is required"),
  salesCounselorName: yup.string().required("Sales counselor name is required"),
  salesCounselorCode: yup.string().required("Sales counselor code is required"),
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  contactNo: yup.string().optional(),
  areaOffice: yup.string().required("Area office is required"),
  userType: yup
    .string()
    .oneOf(["", "ADMIN", "SC"], "Invalid user type")
    .optional(),
});

export type AddUserFormData = yup.InferType<typeof addUserSchema>;
