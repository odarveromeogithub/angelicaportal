import { z } from "zod";

export const planFormSchema = z.object({
  salesCounselorName: z.string().min(1, "Sales Counselor Name is required"),
  salesCounselorCode: z.string().min(1, "Code is required"),
  salesCounselorReferral: z.string().min(1, "Referral is required"),
  contactPrice: z.string().min(1, "Contact Price is required"),
  planType: z.string().min(1, "Plan Type is required"),
  modeOfPayment: z.string().min(1, "Mode of Payment is required"),
  termOfPay: z.string().min(1, "Term of Pay is required"),
  installment: z.string().min(1, "Installment is required"),
  docStamp: z.string().min(1, "Doc Stamp is required"),
});

export const planholderFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  nameExtension: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gender: z.string().min(1, "Gender is required"),
  civilStatus: z.string().min(1, "Civil Status is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  contactNumber: z
    .string()
    .min(7, "Contact Number must be at least 7 digits")
    .regex(/^[0-9]{7,}$/, "Contact Number must contain only digits"),
  lotHouseNumber: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  barangay: z.string().min(1, "Barangay is required"),
  cityMunicipal: z.string().min(1, "City/Municipal is required"),
  province: z.string().min(1, "Province is required"),
  zipCode: z.string().min(4, "Zip Code is required"),
});

export const beneficiaryFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  nameExtension: z.string().optional(),
  age: z.string().min(1, "Age is required").regex(/^\d+$/, "Age must be a number"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(1, "Address is required"),
  relationship: z.string().min(1, "Relationship is required"),
});

export const submitFormSchema = z.object({
  planholder_signature: z.string().min(1, "Signature is required"),
  id_upload: z.instanceof(File).optional().nullable(),
  agree_to_consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the consent",
  }),
});

export const angelicaLifePlanSchema = z.object({
  plan: planFormSchema,
  planholder: planholderFormSchema,
  beneficiaries: z.array(beneficiaryFormSchema).min(1, "At least one beneficiary is required"),
  planholder_signature: z.string().min(1, "Signature is required"),
  id_upload: z.instanceof(File).nullable(),
  agree_to_consent: z.boolean(),
});

export type PlanFormSchema = z.infer<typeof planFormSchema>;
export type PlanholderFormSchema = z.infer<typeof planholderFormSchema>;
export type BeneficiaryFormSchema = z.infer<typeof beneficiaryFormSchema>;
export type SubmitFormSchema = z.infer<typeof submitFormSchema>;
export type AngelicaLifePlanSchema = z.infer<typeof angelicaLifePlanSchema>;
