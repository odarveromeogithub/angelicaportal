/**
 * Plan form data - step 1
 * contactPrice, installment, docStamp are numeric strings validated by schema
 * planType, modeOfPayment, termOfPay must be from allowed options
 */
export interface IPlanFormData {
  salesCounselorName: string;
  salesCounselorCode: string;
  salesCounselorReferral: string; // Must be valid URL
  contactPrice: string; // Numeric string (digits and optional decimal)
  planType: string; // Must be one of: "Angelica Life Plan 5", "10", "15"
  modeOfPayment: string; // Must be one of: "Monthly", "Quarterly", "Annual"
  termOfPay: string; // Must be one of: "Installment", "Single Premium"
  installment: string; // Numeric string (digits and optional decimal)
  docStamp: string; // Numeric string (digits and optional decimal)
}

/**
 * Planholder form data - step 2
 * contactNumber must be valid international phone number
 * zipCode must be 4-6 digits
 * dateOfBirth must be valid past date (yyyy-MM-dd format)
 * gender, civilStatus must be from allowed options
 */
export interface IPlanholderFormData {
  firstName: string;
  middleName: string; // Optional
  lastName: string;
  nameExtension: string; // Optional
  dateOfBirth: string; // yyyy-MM-dd format, must be past date
  gender: string; // Must be one of: "Male", "Female"
  civilStatus: string; // Must be one of: "Single", "Married", "Widowed", "Separated", "Divorced"
  email: string;
  contactNumber: string; // International phone number with country code
  contactNumberCountryCode: string; // Country code (e.g., "+63", "+1")
  lotHouseNumber: string; // Optional
  street: string;
  barangay: string;
  cityMunicipal: string;
  province: string;
  zipCode: string; // 4-6 digits
}

/**
 * Beneficiary form data - step 3
 * age must be numeric string (digits only)
 * gender must be from allowed options
 */
export interface IBeneficiaryFormData {
  firstName: string;
  middleName: string; // Optional
  lastName: string;
  nameExtension: string; // Optional
  age: string; // Numeric string (digits only)
  gender: string; // Must be one of: "Male", "Female"
  address: string;
  relationship: string;
}

export interface IAngelicaLifePlanFormData {
  plan: IPlanFormData;
  planholder: IPlanholderFormData;
  beneficiaries: IBeneficiaryFormData[];
  planholder_signature: string;
  id_upload: File | null;
  agree_to_consent: boolean;
}
