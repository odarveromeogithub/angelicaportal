import httpClient from "../../clients/httpclients";
import type { LoginPayload } from "../../state/types/auth";
import type { RegisterUserParam } from "../../interfaces/auth.interface";
import { USE_MOCK_DATA } from "../../config/env";
import {
  validateMockCredentials,
  getMockOAuthResponse,
  getMockUserData,
  MOCK_USER_DATA,
} from "../../mocks/auth.mock";
import { API_ENDPOINTS } from "../../constants/api";

export const loginRequest = async (payload: LoginPayload) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate credentials
    if (validateMockCredentials(payload.email, payload.password)) {
      const mockResponse = getMockOAuthResponse(payload.email);
      return {
        data: mockResponse,
        status: 200,
        statusText: "OK",
      };
    } else {
      throw new Error("Invalid credentials");
    }
  }

  return httpClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
};

export const registerRequest = async (payload: RegisterUserParam) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return mock user data
    return {
      data: {
        ...MOCK_USER_DATA,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
      },
      status: 201,
      statusText: "Created",
    };
  }

  return httpClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
};

export const getUserData = async (userEmail?: string) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get email to return corresponding mock user
    const email = userEmail || localStorage.getItem("access_token");
    
    // Return mock user data based on email
    const mockUser = getMockUserData(email || "test@example.com") || MOCK_USER_DATA;
    return {
      data: mockUser,
      status: 200,
      statusText: "OK",
    };
  }

  return httpClient.get(API_ENDPOINTS.AUTH.USER);
};
