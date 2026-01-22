import axios from "axios";
import type { ClientPlan } from "../../interfaces/dashboard.interface";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Client List API Service
 * Handles client plan management (SC and Admin only)
 */
export const clientListApi = {
  /**
   * Fetch all client plans
   */
  async fetchClientList(): Promise<ClientPlan[]> {
    const response = await axios.get<ClientPlan[]>(`${API_BASE_URL}/dashboard/clients`);
    return response.data;
  },

  /**
   * Fetch a single client plan by ID
   */
  async fetchClientById(clientId: string): Promise<ClientPlan> {
    const response = await axios.get<ClientPlan>(`${API_BASE_URL}/dashboard/clients/${clientId}`);
    return response.data;
  },

  /**
   * Update client plan
   */
  async updateClientPlan(clientId: string, planData: Partial<ClientPlan>): Promise<ClientPlan> {
    const response = await axios.put<ClientPlan>(`${API_BASE_URL}/dashboard/clients/${clientId}`, planData);
    return response.data;
  },

  /**
   * Delete client plan
   */
  async deleteClientPlan(clientId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/dashboard/clients/${clientId}`);
  },

  /**
   * Assign sales counselor to client
   */
  async assignSalesCounselor(clientId: string, scId: string): Promise<ClientPlan> {
    const response = await axios.post<ClientPlan>(`${API_BASE_URL}/dashboard/clients/${clientId}/assign-sc`, {
      sales_counselor_id: scId,
    });
    return response.data;
  },
};
