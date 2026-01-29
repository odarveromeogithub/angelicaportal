import { createSlice } from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginRequestActionPayload,
  RegisterRequestActionPayload,
} from "../../types";
import { setTokens, clearTokens } from "../../../helpers/authStorage";

const initialState: AuthState = {
  login: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  register: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login Actions
    login(state, _action: LoginRequestActionPayload) {
      void _action; // keep action typed while unused
      state.login = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    loginSuccess(state, action) {
      state.login = {
        data: action.payload,
        loading: false,
        success: true,
        error: false,
      };
      // Store tokens in localStorage when login succeeds
      if (action.payload?.access_token) {
        setTokens(action.payload.access_token, action.payload.refresh_token);
      }
    },
    loginFailure(state) {
      state.login = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
    resetLogin(state) {
      state.login = {
        data: undefined,
        loading: false,
        success: false,
        error: false,
      };
    },

    // Register Actions
    register(state, _action: RegisterRequestActionPayload) {
      void _action; // keep action typed while unused
      state.register = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    registerSuccess(state, action) {
      state.register = {
        data: action.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    registerFailure(state) {
      state.register = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
    resetRegister(state) {
      state.register = {
        data: undefined,
        loading: false,
        success: false,
        error: false,
      };
    },

    // User Actions
    setUser(state, action) {
      state.user = {
        data: action.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    clearUser(state) {
      state.user = null;
    },

    // Logout
    logout(state) {
      state.login = initialState.login;
      state.register = initialState.register;
      state.user = null;
      // Clear tokens from localStorage
      clearTokens();
    },
  },
});

export const {
  login,
  loginSuccess,
  loginFailure,
  resetLogin,
  register,
  registerSuccess,
  registerFailure,
  resetRegister,
  setUser,
  clearUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
