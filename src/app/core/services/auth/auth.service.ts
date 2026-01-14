import httpClient from "../../clients/httpclients";
import type { LoginPayload } from "../../state/types/auth";
import type { RegisterUserParam } from "../../interfaces/auth.interface";
import { USE_MOCK_DATA } from "../../config";
import {
  validateMockCredentials,
  getMockOAuthResponse,
  getMockUserData,
  MOCK_USER_DATA,
} from "../../mocks/auth.mock";

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

  return httpClient.post("/api/v1/auth/login", payload);
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

  return httpClient.post("/api/v1/auth/register", payload);
};

export const getUserData = async () => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get email from localStorage to return corresponding mock user
    const token = localStorage.getItem("access_token");
    if (token) {
      // Try to extract email from mock data (in real scenario, decode JWT)
      // For demo, return default mock user
      const mockUser = getMockUserData("test@example.com") || MOCK_USER_DATA;
      return {
        data: mockUser,
        status: 200,
        statusText: "OK",
      };
    }
    throw new Error("No token found");
  }

  return httpClient.get("/api/v1/auth/user");
};
