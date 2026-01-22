import axios from "axios";
import type { WaitingListItem } from "../../interfaces/dashboard.interface";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Waiting List API Service
 * Handles waiting list management
 */
export const waitingListApi = {
  /**
   * Fetch all waiting list items
   */
  async fetchWaitingList(): Promise<WaitingListItem[]> {
    const response = await axios.get<WaitingListItem[]>(`${API_BASE_URL}/dashboard/waiting-list`);
    return response.data;
  },

  /**
   * Fetch a single waiting list item by ID
   */
  async fetchWaitingListItemById(itemId: string): Promise<WaitingListItem> {
    const response = await axios.get<WaitingListItem>(`${API_BASE_URL}/dashboard/waiting-list/${itemId}`);
    return response.data;
  },

  /**
   * Add a new item to waiting list
   */
  async addToWaitingList(itemData: Partial<WaitingListItem>): Promise<WaitingListItem> {
    const response = await axios.post<WaitingListItem>(`${API_BASE_URL}/dashboard/waiting-list`, itemData);
    return response.data;
  },

  /**
   * Update waiting list item status
   */
  async updateWaitingListItem(itemId: string, itemData: Partial<WaitingListItem>): Promise<WaitingListItem> {
    const response = await axios.put<WaitingListItem>(`${API_BASE_URL}/dashboard/waiting-list/${itemId}`, itemData);
    return response.data;
  },

  /**
   * Remove item from waiting list
   */
  async removeFromWaitingList(itemId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/dashboard/waiting-list/${itemId}`);
  },

  /**
   * Approve waiting list item
   */
  async approveWaitingListItem(itemId: string): Promise<WaitingListItem> {
    const response = await axios.post<WaitingListItem>(`${API_BASE_URL}/dashboard/waiting-list/${itemId}/approve`);
    return response.data;
  },

  /**
   * Reject waiting list item
   */
  async rejectWaitingListItem(itemId: string, reason?: string): Promise<WaitingListItem> {
    const response = await axios.post<WaitingListItem>(`${API_BASE_URL}/dashboard/waiting-list/${itemId}/reject`, {
      reason,
    });
    return response.data;
  },
};
