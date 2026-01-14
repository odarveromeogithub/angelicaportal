export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  remember_token?: number;
  role: 'admin' | 'client' | 'sc' | 'um';
  email_verified_at?: string | null;
  sms_verified_at?: string | null;
  username: string;
  contact_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  name_extension?: string;
  gender?: string;
  birthdate?: string;
  added_by_user?: number;
  remarks?: string;
  referral_link_code?: string;
  referral_code?: string;
  is_active: boolean | number;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
  sales_counselor_id?: number;
}

