import * as yup from "yup";

export const planFormSchema = yup.object().shape({
  salesCounselorName: yup.string().required("Sales Counselor Name is required"),
  salesCounselorCode: yup.string().required("Code is required"),
  salesCounselorReferral: yup.string().required("Referral is required"),
  contactPrice: yup.string().required("Contact Price is required"),
  planType: yup.string().required("Plan Type is required"),
  modeOfPayment: yup.string().required("Mode of Payment is required"),
  termOfPay: yup.string().required("Term of Pay is required"),
  installment: yup.string().required("Installment is required"),
  docStamp: yup.string().required("Doc Stamp is required"),
});

export const planholderFormSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().notRequired(),
  lastName: yup.string().required("Last Name is required"),
  nameExtension: yup.string().notRequired(),
  dateOfBirth: yup.string().required("Date of Birth is required"),
  gender: yup.string().required("Gender is required"),
  civilStatus: yup.string().required("Civil Status is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  contactNumber: yup
    .string()
    .min(7, "Contact Number must be at least 7 digits")
    .matches(/^[0-9]{7,}$/, "Contact Number must contain only digits")
    .required("Contact Number is required"),
  lotHouseNumber: yup.string().notRequired(),
  street: yup.string().required("Street is required"),
  barangay: yup.string().required("Barangay is required"),
  cityMunicipal: yup.string().required("City/Municipal is required"),
  province: yup.string().required("Province is required"),
  zipCode: yup.string().min(4, "Zip Code is required").required("Zip Code is required"),
});

export const beneficiaryFormSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().notRequired(),
  lastName: yup.string().required("Last Name is required"),
  nameExtension: yup.string().notRequired(),
  age: yup
    .string()
    .required("Age is required")
    .matches(/^\d+$/, "Age must be a number"),
  gender: yup.string().required("Gender is required"),
  address: yup.string().required("Address is required"),
  relationship: yup.string().required("Relationship is required"),
});

export const submitFormSchema = yup.object().shape({
  planholder_signature: yup.string().required("Signature is required"),
  id_upload: yup.mixed().notRequired().nullable(),
  agree_to_consent: yup
    .boolean()
    .oneOf([true], "You must agree to the consent")
    .required("You must agree to the consent"),
});

export const angelicaLifePlanSchema = yup.object().shape({
  plan: planFormSchema,
  planholder: planholderFormSchema,
  beneficiaries: yup
    .array()
    .of(beneficiaryFormSchema)
    .min(1, "At least one beneficiary is required")
    .required("Beneficiaries are required"),
  planholder_signature: yup.string().required("Signature is required"),
  id_upload: yup.mixed().notRequired().nullable(),
  agree_to_consent: yup.boolean().required(),
});

export type PlanFormSchema = yup.InferType<typeof planFormSchema>;
export type PlanholderFormSchema = yup.InferType<typeof planholderFormSchema>;
export type BeneficiaryFormSchema = yup.InferType<typeof beneficiaryFormSchema>;
export type SubmitFormSchema = yup.InferType<typeof submitFormSchema>;
export type AngelicaLifePlanSchema = yup.InferType<typeof angelicaLifePlanSchema>;
