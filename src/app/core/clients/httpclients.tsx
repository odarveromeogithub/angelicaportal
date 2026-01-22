import axios, { type AxiosError } from "axios";
import { apiUrl } from "../config/env";
import { getAccessToken, clearTokens } from "../helpers/auth-storage";

const httpClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// Request interceptor - add auth token
httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - clear tokens and dispatch event
    if (error.response?.status === 401) {
      clearTokens();
      const event = new CustomEvent('auth:unauthorized');
      window.dispatchEvent(event);
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;