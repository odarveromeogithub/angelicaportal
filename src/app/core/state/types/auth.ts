import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  IOauth,
  RegisterUserParam,
} from "../../interfaces/auth.interface";
import type { LoadingResult } from "../../interfaces/common.interface";
import type {
  IUser,
} from "../../interfaces/user.interface";

// Main Auth State for Login & Register only
export interface AuthState {
  login: LoginRequest;
  register: RegisterRequest;
  user: User | null;
}

// Login Types
export type LoginRequest = LoadingResult & {
  data?: IOauth;
};

export type LoginRequestActionPayload = PayloadAction<LoginPayload>;

export type LoginPayload = {
  email: string;
  password: string;
};

// Register Types
export type RegisterRequest = LoadingResult & {
  data?: IUser;
};

export type RegisterRequestActionPayload = PayloadAction<RegisterUserParam>;

// User Type
export type User = LoadingResult & {
  data?: IUser;
};
