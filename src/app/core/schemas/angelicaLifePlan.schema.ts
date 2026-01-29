import * as yup from "yup";
import {
  ACCEPTED_FILE_TYPES,
  CIVIL_STATUS_OPTIONS,
  GENDER_OPTIONS,
  MAX_FILE_SIZE_BYTES,
  PAYMENT_MODES,
  PAYMENT_TERMS,
  PLAN_TYPES,
} from "../constants/angelicaLifePlan";

const PLAN_TYPE_VALUES = PLAN_TYPES.map((option) => option.value);
const PAYMENT_MODE_VALUES = PAYMENT_MODES.map((option) => option.value);
const PAYMENT_TERM_VALUES = PAYMENT_TERMS.map((option) => option.value);
const GENDER_VALUES = GENDER_OPTIONS.map((option) => option.value);
const CIVIL_STATUS_VALUES = CIVIL_STATUS_OPTIONS.map((option) => option.value);
const ACCEPTED_MIME_TYPES = Object.keys(ACCEPTED_FILE_TYPES);
const ACCEPTED_EXTENSIONS = Object.values(ACCEPTED_FILE_TYPES).flat();

const numericString = (label: string) =>
  yup
    .string()
    .required(`${label} is required`)
    .matches(/^\d+(\.\d{1,2})?$/, `${label} must be a valid number`);

export const planFormSchema = yup.object().shape({
  salesCounselorName: yup.string().required("Sales Counselor Name is required"),
  salesCounselorCode: yup.string().required("Sales Counselor Code is required"),
  salesCounselorReferral: yup.string().required("Referral is required"),
  contactPrice: numericString("Contact Price"),
  planType: yup
    .string()
    .oneOf(PLAN_TYPE_VALUES, "Invalid plan type")
    .required("Plan Type is required"),
  modeOfPayment: yup
    .string()
    .oneOf(PAYMENT_MODE_VALUES, "Invalid payment mode")
    .required("Mode of Payment is required"),
  termOfPay: yup
    .string()
    .oneOf(PAYMENT_TERM_VALUES, "Invalid term of pay")
    .required("Term of Pay is required"),
  installment: numericString("Installment"),
  docStamp: numericString("Doc Stamp"),
});

export const planholderFormSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().notRequired(),
  lastName: yup.string().required("Last Name is required"),
  nameExtension: yup.string().notRequired(),
  dateOfBirth: yup
    .string()
    .required("Date of Birth is required")
    .test("valid-date", "Date of Birth must be a valid date", (value) => {
      if (!value) return false;
      const parsed = Date.parse(value);
      return Number.isFinite(parsed) && parsed <= Date.now();
    }),
  gender: yup
    .string()
    .oneOf(GENDER_VALUES, "Invalid gender")
    .required("Gender is required"),
  civilStatus: yup
    .string()
    .oneOf(CIVIL_STATUS_VALUES, "Invalid civil status")
    .required("Civil Status is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  contactNumberCountryCode: yup.string().required("Country code is required"),
  contactNumber: yup
    .string()
    .matches(/^\d{1,14}$/, "Contact Number must be 1-14 digits")
    .required("Contact Number is required"),
  lotHouseNumber: yup.string().notRequired(),
  street: yup.string().required("Street is required"),
  barangay: yup.string().required("Barangay is required"),
  cityMunicipal: yup.string().required("City/Municipal is required"),
  province: yup.string().required("Province is required"),
  zipCode: yup
    .string()
    .matches(/^\d{4,6}$/, "Zip Code must be 4-6 digits")
    .required("Zip Code is required"),
});

export const beneficiaryFormSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().notRequired(),
  lastName: yup.string().required("Last Name is required"),
  nameExtension: yup.string().notRequired(),
  age: yup
    .string()
    .matches(/^\d+$/, "Age must be a number")
    .required("Age is required"),
  gender: yup
    .string()
    .oneOf(GENDER_VALUES, "Invalid gender")
    .required("Gender is required"),
  address: yup.string().required("Address is required"),
  relationship: yup.string().required("Relationship is required"),
});

const fileValidation = yup
  .mixed()
  .nullable()
  .typeError("File must be a valid file")
  .test(
    "file-size",
    `File must be ${Math.floor(MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB or less`,
    (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= MAX_FILE_SIZE_BYTES;
    },
  )
  .test("file-type", "Unsupported file type", (value) => {
    if (!value || !(value instanceof File)) return true;
    const isAllowedMime = ACCEPTED_MIME_TYPES.includes(value.type);
    const isAllowedExt = ACCEPTED_EXTENSIONS.some((ext) =>
      value.name.toLowerCase().endsWith(ext),
    );
    return isAllowedMime || isAllowedExt;
  }) as yup.Schema<File | null>;

export const submitFormSchema = yup.object().shape({
  planholder_signature: yup.string().required("Signature is required"),
  id_upload: fileValidation,
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
  id_upload: fileValidation,
  agree_to_consent: yup
    .boolean()
    .oneOf([true], "You must agree to the consent"),
});

export type PlanFormSchema = yup.InferType<typeof planFormSchema>;
export type PlanholderFormSchema = yup.InferType<typeof planholderFormSchema>;
export type BeneficiaryFormSchema = yup.InferType<typeof beneficiaryFormSchema>;
export type SubmitFormSchema = yup.InferType<typeof submitFormSchema>;
export type AngelicaLifePlanSchema = yup.InferType<
  typeof angelicaLifePlanSchema
>;
