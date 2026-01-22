import type { IOauth } from "../interfaces/auth.interface";
import type { IUser } from "../interfaces/user.interface";
import type { LoginPayload } from "../state/types/auth";

/**
 * Mock Login Credentials
 * Use these credentials to test the login functionality with different roles:
 * 
 * ADMIN: admin@example.com / Admin123!
 * CLIENT: client@example.com / Client123!
 * SALES COUNSELOR (SC): sc@example.com / SC123!@
 * USER MANAGER (UM): um@example.com / UM123!@
 * 
 * Note: UM role has admin-level access
 */
export const MOCK_LOGIN_CREDENTIALS: LoginPayload[] = [
  {
    email: "admin@example.com",
    password: "Admin123!",
  },
  {
    email: "client@example.com",
    password: "Client123!",
  },
  {
    email: "sc@example.com",
    password: "SC12345!",
  },
  {
    email: "um@example.com",
    password: "UM12345!",
  },
];

/**
 * Default test credentials - CLIENT role
 */
export const DEFAULT_TEST_LOGIN: LoginPayload = {
  email: "client@example.com",
  password: "Client123!",
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
 * Mock User Data - Default CLIENT user
 */
export const MOCK_USER_DATA: IUser = {
  id: 5,
  name: "Client User",
  email: "client@example.com",
  username: "clientuser",
  first_name: "Client",
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
  client: {
    credentials: {
      email: "client@example.com",
      password: "Client123!",
    },
    oauth: {
      token_type: "Bearer",
      expires_in: 3600,
      access_token: "mock_client_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      refresh_token: "mock_client_refresh_token",
    },
    user: {
      id: 2,
      name: "Client User",
      email: "client@example.com",
      username: "clientuser",
      first_name: "Client",
      last_name: "User",
      contact_number: "+63900000002",
      role: "client" as const,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  sc: {
    credentials: {
      email: "sc@example.com",
      password: "SC123!@",
    },
    oauth: {
      token_type: "Bearer",
      expires_in: 3600,
      access_token: "mock_sc_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      refresh_token: "mock_sc_refresh_token",
    },
    user: {
      id: 3,
      name: "Sales Counselor",
      email: "sc@example.com",
      username: "salescounselor",
      first_name: "Sales",
      last_name: "Counselor",
      contact_number: "+63900000003",
      role: "sc" as const,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  um: {
    credentials: {
      email: "um@example.com",
      password: "UM123!@",
    },
    oauth: {
      token_type: "Bearer",
      expires_in: 3600,
      access_token: "mock_um_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      refresh_token: "mock_um_refresh_token",
    },
    user: {
      id: 4,
      name: "User Manager",
      email: "um@example.com",
      username: "usermanager",
      first_name: "User",
      last_name: "Manager",
      contact_number: "+63900000004",
      role: "um" as const,
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
  if (email === "client@example.com") {
    return MOCK_USERS_BY_ROLE.client.oauth;
  }
  if (email === "sc@example.com") {
    return MOCK_USERS_BY_ROLE.sc.oauth;
  }
  if (email === "um@example.com") {
    return MOCK_USERS_BY_ROLE.um.oauth;
  }
  return MOCK_OAUTH_RESPONSE;
};

/**
 * Helper function to get mock user data for a specific email
 */
export const getMockUserData = (email: string): IUser | null => {
  if (email === "admin@example.com") {
    return MOCK_USERS_BY_ROLE.admin.user;
  }
  if (email === "client@example.com") {
    return MOCK_USERS_BY_ROLE.client.user;
  }
  if (email === "sc@example.com") {
    return MOCK_USERS_BY_ROLE.sc.user;
  }
  if (email === "um@example.com") {
    return MOCK_USERS_BY_ROLE.um.user;
  }
  return MOCK_USER_DATA;
};