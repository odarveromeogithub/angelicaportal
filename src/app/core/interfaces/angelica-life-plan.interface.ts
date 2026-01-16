export interface IPlanFormData {
  salesCounselorName: string;
  salesCounselorCode: string;
  salesCounselorReferral: string;
  contactPrice: number | string;
  planType: string;
  modeOfPayment: string;
  termOfPay: string;
  installment: number | string;
  docStamp: number | string;
}

export interface IPlanholderFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  nameExtension: string;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
  email: string;
  contactNumber: string;
  lotHouseNumber: string;
  street: string;
  barangay: string;
  cityMunicipal: string;
  province: string;
  zipCode: string;
}

export interface IBeneficiaryFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  nameExtension: string;
  age: number | string;
  gender: string;
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
