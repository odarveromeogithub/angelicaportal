import axios, { type AxiosError } from "axios";
import { apiUrl } from "../config/env";
import { getAccessToken, clearTokens } from "../helpers/auth-storage";

const BASEURL = apiUrl;

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

const httpClient = axios.create({
  baseURL: BASEURL,
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
    return Promise.reject(normalizeError(error));
  }
);

// Response interceptor - handle errors and retries
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean; _retryCount?: number };

    // Handle 401 Unauthorized - clear tokens and redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      clearTokens();
      
      // Dispatch logout action if store is available
      const event = new CustomEvent('auth:unauthorized');
      window.dispatchEvent(event);
      
      return Promise.reject(normalizeError(error));
    }

    // Retry logic for network errors or 5xx errors
    if (shouldRetry(error) && (!originalRequest._retryCount || originalRequest._retryCount < 2)) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Exponential backoff
      const delay = originalRequest._retryCount * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return httpClient(originalRequest);
    }

    return Promise.reject(normalizeError(error));
  }
);

// Normalize errors to consistent format
function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    
    return {
      message: axiosError.response?.data?.message 
        || axiosError.response?.data?.error 
        || axiosError.message 
        || 'An unexpected error occurred',
      status: axiosError.response?.status,
      code: axiosError.code,
      details: axiosError.response?.data,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: 'An unknown error occurred',
  };
}

// Determine if request should be retried
function shouldRetry(error: AxiosError): boolean {
  // Retry on network errors
  if (!error.response) {
    return true;
  }
  
  // Retry on 5xx server errors (except 501 Not Implemented)
  const status = error.response.status;
  return status >= 500 && status !== 501;
}

export default httpClient;