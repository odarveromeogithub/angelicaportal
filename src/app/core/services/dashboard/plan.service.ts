import axios from "axios";
import type { Plan } from "../../interfaces/dashboard.interface";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Dashboard API Service
 * Handles all dashboard-related API calls
 */
export const dashboardApi = {
  /**
   * Fetch all plans for the authenticated user
   */
  async fetchPlans(): Promise<Plan[]> {
    const response = await axios.get<Plan[]>(`${API_BASE_URL}/dashboard/plans`);
    return response.data;
  },

  /**
   * Fetch a single plan by ID
   */
  async fetchPlanById(planId: string): Promise<Plan> {
    const response = await axios.get<Plan>(`${API_BASE_URL}/dashboard/plans/${planId}`);
    return response.data;
  },

  /**
   * Create a new plan
   */
  async createPlan(planData: Partial<Plan>): Promise<Plan> {
    const response = await axios.post<Plan>(`${API_BASE_URL}/dashboard/plans`, planData);
    return response.data;
  },

  /**
   * Update an existing plan
   */
  async updatePlan(planId: string, planData: Partial<Plan>): Promise<Plan> {
    const response = await axios.put<Plan>(`${API_BASE_URL}/dashboard/plans/${planId}`, planData);
    return response.data;
  },

  /**
   * Delete a plan
   */
  async deletePlan(planId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/dashboard/plans/${planId}`);
  },
};
