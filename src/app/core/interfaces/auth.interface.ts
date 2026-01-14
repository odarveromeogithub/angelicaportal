import type { IUser } from "./user.interface";

export interface IOauth {
    token_type: string;
    expires_in: number;
    refresh_token: string;
    access_token: string;
}

export type RegisterUserParam = {
    email: string;
    first_name: string;
    last_name: string;
    contact_no: string;
    area: string;
    middle_name?: string;
};

export type OtpVerificationParam = {
    email: string;
    otp: string;
};

export type OtpResponse = {
    success: boolean;
    message: string;
    access_token?: string;
    user?: IUser;
};

export interface IUserRegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  contact_no: string;
  username?: string;
  gender?: string;
  birthdate?: string;
  area?: string;
}

export interface IUserLoginRequest {
  email: string;
  password: string;
}

export interface IUserLoginResponse {
  access_token: string;
  user: IUser;
}
