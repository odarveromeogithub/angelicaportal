import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiUrl } from "../config/env";
import { getAccessToken, getRefreshToken, clearTokens, setTokens } from "../helpers/auth-storage";

const BASEURL = apiUrl;

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: ApiError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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

// Response interceptor - handle errors, token refresh, and retries
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return httpClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token, clear auth and redirect
        clearTokens();
        const event = new CustomEvent('auth:unauthorized');
        window.dispatchEvent(event);
        return Promise.reject(normalizeError(error));
      }

      try {
        // Attempt to refresh the access token
        const response = await axios.post<RefreshTokenResponse>(
          `${BASEURL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token } = response.data;

        // Store new tokens
        setTokens(access_token, refresh_token || refreshToken);

        // Update Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        // Process queued requests
        processQueue(null, access_token);

        // Retry original request
        return httpClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        processQueue(normalizeError(refreshError), null);
        clearTokens();
        
        const event = new CustomEvent('auth:unauthorized');
        window.dispatchEvent(event);
        
        return Promise.reject(normalizeError(refreshError));
      } finally {
        isRefreshing = false;
      }
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