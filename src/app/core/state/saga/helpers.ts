import { call } from 'redux-saga/effects';

/**
 * Saga helper that calls an API service and falls back to mock data in development if the API fails
 * @param apiCall - The API service function to call
 * @param mockData - Mock data to return if API fails (in development only)
 * @returns The API response or mock data
 */
export function* callApiWithFallback<T>(
  apiCall: () => Promise<T>,
  mockData: T
): Generator<any, T, any> {
  try {
    // Try to call the real API
    const result: T = yield call(apiCall);
    return result;
  } catch (error: any) {
    // In development mode, fall back to mock data
    if (import.meta.env.DEV) {
      console.warn('API call failed, using mock data:', error.message);
      return mockData;
    }
    // In production, rethrow the error
    throw error;
  }
}

/**
 * Extract error message from various error formats
 * @param error - The error object
 * @returns A user-friendly error message
 */
export function extractErrorMessage(error: any): string {
  return error.response?.data?.message || error.message || 'An error occurred';
}
