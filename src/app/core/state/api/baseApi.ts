import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import { apiUrl, USE_MOCK_DATA } from "../../config/env";
import { handleMockRequest } from "../../mocks/apiHandlers";

/**
 * Base API configuration for RTK Query
 * Used by all API slices
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const realBaseQuery = fetchBaseQuery({
      baseUrl: apiUrl || "/",
      prepareHeaders: (headers) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });

    if (USE_MOCK_DATA) {
      const mockResult = await handleMockRequest(args as FetchArgs | string);
      if (mockResult.handled) {
        return { data: mockResult.data };
      }
    }

    return realBaseQuery(args, api, extraOptions);
  },
  tagTypes: [
    "Plans",
    "Clients",
    "Agents",
    "Users",
    "WaitingList",
    "AngelicaLifePlan",
  ],
  endpoints: () => ({}), // Endpoints defined in individual API files
});
