import axios from "axios";
import type { SystemUser } from "../../interfaces/dashboard.interface";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * System Users API Service
 * Handles system user management (Admin only)
 */
export const usersListApi = {
  /**
   * Fetch all system users
   */
  async fetchUsersList(): Promise<SystemUser[]> {
    const response = await axios.get<SystemUser[]>(`${API_BASE_URL}/dashboard/users`);
    return response.data;
  },

  /**
   * Fetch a single system user by ID
   */
  async fetchUserById(userId: string): Promise<SystemUser> {
    const response = await axios.get<SystemUser>(`${API_BASE_URL}/dashboard/users/${userId}`);
    return response.data;
  },

  /**
   * Create a new system user
   */
  async createUser(userData: Partial<SystemUser>): Promise<SystemUser> {
    const response = await axios.post<SystemUser>(`${API_BASE_URL}/dashboard/users`, userData);
    return response.data;
  },

  /**
   * Update system user details
   */
  async updateUser(userId: string, userData: Partial<SystemUser>): Promise<SystemUser> {
    const response = await axios.put<SystemUser>(`${API_BASE_URL}/dashboard/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Delete system user
   */
  async deleteUser(userId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/dashboard/users/${userId}`);
  },

  /**
   * Activate system user
   */
  async activateUser(userId: string): Promise<SystemUser> {
    const response = await axios.post<SystemUser>(`${API_BASE_URL}/dashboard/users/${userId}/activate`);
    return response.data;
  },

  /**
   * Deactivate system user
   */
  async deactivateUser(userId: string): Promise<SystemUser> {
    const response = await axios.post<SystemUser>(`${API_BASE_URL}/dashboard/users/${userId}/deactivate`);
    return response.data;
  },

  /**
   * Reset user password
   */
  async resetUserPassword(userId: string): Promise<{ temporary_password: string }> {
    const response = await axios.post<{ temporary_password: string }>(
      `${API_BASE_URL}/dashboard/users/${userId}/reset-password`
    );
    return response.data;
  },
};
