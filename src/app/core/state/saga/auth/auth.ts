import { takeLatest, call, put } from "redux-saga/effects";
import {
  login,
  loginSuccess,
  loginFailure,
  setUser,
  register,
  registerSuccess,
  registerFailure,
} from "../../reducer/auth";
import {
  loginRequest,
  registerRequest,
  getUserData,
} from "../../../services/auth/auth.service";
import type { AxiosResponse } from "axios";
import type {
  LoginRequestActionPayload,
  RegisterRequestActionPayload,
} from "../../types";

function* loginRequestSaga(action: LoginRequestActionPayload) {
  try {
    const response: AxiosResponse = yield call(loginRequest, action.payload);
    yield put(loginSuccess(response.data));
    
    // Fetch user data after successful login - pass the email
    try {
      const userResponse: AxiosResponse = yield call(
        getUserData,
        action.payload.email
      );
      yield put(setUser(userResponse.data));
    } catch (userError: unknown) {
      if (import.meta.env.DEV) {
        console.error("Failed to fetch user data:", userError);
      }
    }
  } catch (error: unknown) {
    yield put(loginFailure());
    if (import.meta.env.DEV) {
      console.error("Login failed:", error);
    }
  }
}

function* registerRequestSaga(action: RegisterRequestActionPayload) {
  try {
    const response: AxiosResponse = yield call(registerRequest, action.payload);
    yield put(registerSuccess(response.data));
  } catch (error: unknown) {
    yield put(registerFailure());
    if (import.meta.env.DEV) {
      console.error("Registration failed:", error);
    }
  }
}

export function* rootSaga() {
  yield takeLatest(login.type, loginRequestSaga);
  yield takeLatest(register.type, registerRequestSaga);
}
