import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base API configuration for RTK Query
 * Used by all API slices
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/', // Base URL from environment or default
    prepareHeaders: (headers) => {
      // Add auth token to headers
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Plans', 'Clients', 'Agents', 'Users', 'WaitingList', 'AngelicaLifePlan'],
  endpoints: () => ({}), // Endpoints defined in individual API files
});
