import type { IOauth } from "../interfaces/auth.interface";
import type { IUser } from "../interfaces/user.interface";
import type { LoginPayload } from "../state/types/auth";

/**
 * Mock Login Credentials
 * Use these credentials to test the login functionality
 */
export const MOCK_LOGIN_CREDENTIALS: LoginPayload[] = [
  {
    email: "admin@example.com",
    password: "Admin123!",
  },
  {
    email: "user@example.com",
    password: "User123!",
  },
  {
    email: "test@example.com",
    password: "Test123!",
  },
];

/**
 * Default test credentials
 */
export const DEFAULT_TEST_LOGIN: LoginPayload = {
  email: "test@example.com",
  password: "Test123!",
};

/**
 * Mock OAuth Response
 * This is what the API would return on successful login
 */
export const MOCK_OAUTH_RESPONSE: IOauth = {
  token_type: "Bearer",
  expires_in: 3600,
  access_token: "mock_access_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  refresh_token: "mock_refresh_token_dGhpcyBpcyBhIG1vY2sgcmVmcmVzaCB0b2tlbg",
};

/**
 * Mock User Data
 * This is what the API might return for user information
 */
export const MOCK_USER_DATA: IUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  username: "testuser",
  first_name: "Test",
  last_name: "User",
  contact_number: "+63912345678",
  role: "client",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock Users by Role
 */
export const MOCK_USERS_BY_ROLE = {
  admin: {
    credentials: {
      email: "admin@example.com",
      password: "Admin123!",
    },
    oauth: {
      token_type: "Bearer",
      expires_in: 3600,
      access_token: "mock_admin_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      refresh_token: "mock_admin_refresh_token",
    },
    user: {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      username: "admin",
      first_name: "Admin",
      last_name: "User",
      contact_number: "+63900000001",
      role: "admin" as const,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  user: {
    credentials: {
      email: "user@example.com",
      password: "User123!",
    },
    oauth: {
      token_type: "Bearer",
      expires_in: 3600,
      access_token: "mock_user_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      refresh_token: "mock_user_refresh_token",
    },
    user: {
      id: 2,
      name: "Regular User",
      email: "user@example.com",
      username: "regularuser",
      first_name: "Regular",
      last_name: "User",
      contact_number: "+63900000002",
      role: "client" as const,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
};

/**
 * Helper function to validate mock credentials
 */
export const validateMockCredentials = (
  email: string,
  password: string
): boolean => {
  return MOCK_LOGIN_CREDENTIALS.some(
    (cred) => cred.email === email && cred.password === password
  );
};

/**
 * Helper function to get mock OAuth response for a specific user
 */
export const getMockOAuthResponse = (email: string): IOauth | null => {
  if (email === "admin@example.com") {
    return MOCK_USERS_BY_ROLE.admin.oauth;
  }
  if (email === "user@example.com") {
    return MOCK_USERS_BY_ROLE.user.oauth;
  }
  if (email === "test@example.com") {
    return MOCK_OAUTH_RESPONSE;
  }
  return null;
};

/**
 * Helper function to get mock user data for a specific email
 */
export const getMockUserData = (email: string): IUser | null => {
  if (email === "admin@example.com") {
    return MOCK_USERS_BY_ROLE.admin.user;
  }
  if (email === "user@example.com") {
    return MOCK_USERS_BY_ROLE.user.user;
  }
  if (email === "test@example.com") {
    return MOCK_USER_DATA;
  }
  return null;
};
