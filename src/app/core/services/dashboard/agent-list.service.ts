import axios from "axios";
import type { Agent } from "../../interfaces/dashboard.interface";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Agent List API Service
 * Handles agent/sales counselor management (Admin only)
 */
export const agentListApi = {
  /**
   * Fetch all agents
   */
  async fetchAgentList(): Promise<Agent[]> {
    const response = await axios.get<Agent[]>(`${API_BASE_URL}/dashboard/agents`);
    return response.data;
  },

  /**
   * Fetch a single agent by ID
   */
  async fetchAgentById(agentId: string): Promise<Agent> {
    const response = await axios.get<Agent>(`${API_BASE_URL}/dashboard/agents/${agentId}`);
    return response.data;
  },

  /**
   * Create a new agent
   */
  async createAgent(agentData: Partial<Agent>): Promise<Agent> {
    const response = await axios.post<Agent>(`${API_BASE_URL}/dashboard/agents`, agentData);
    return response.data;
  },

  /**
   * Update agent details
   */
  async updateAgent(agentId: string, agentData: Partial<Agent>): Promise<Agent> {
    const response = await axios.put<Agent>(`${API_BASE_URL}/dashboard/agents/${agentId}`, agentData);
    return response.data;
  },

  /**
   * Delete/deactivate agent
   */
  async deleteAgent(agentId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/dashboard/agents/${agentId}`);
  },

  /**
   * Activate agent
   */
  async activateAgent(agentId: string): Promise<Agent> {
    const response = await axios.post<Agent>(`${API_BASE_URL}/dashboard/agents/${agentId}/activate`);
    return response.data;
  },

  /**
   * Deactivate agent
   */
  async deactivateAgent(agentId: string): Promise<Agent> {
    const response = await axios.post<Agent>(`${API_BASE_URL}/dashboard/agents/${agentId}/deactivate`);
    return response.data;
  },
};
