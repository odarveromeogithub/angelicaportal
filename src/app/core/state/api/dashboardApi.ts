import { baseApi } from "./baseApi";
import type {
  Plan,
  ClientPlan,
  Agent,
  User,
  WaitingList,
} from "../../interfaces/dashboard.interface";

/**
 * Dashboard RTK Query API
 * Handles all dashboard-related data fetching
 */
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Plans
    getPlans: builder.query<Plan[], { page?: number; limit?: number } | void>({
      query: (params) => {
        if (params?.page && params?.limit) {
          return `dashboard/plans?page=${params.page}&limit=${params.limit}`;
        }
        return "dashboard/plans";
      },
      providesTags: ["Plans"],
    }),

    getPlanById: builder.query<Plan, string>({
      query: (id) => `dashboard/plans/${id}`,
      providesTags: (result, error, id) => [{ type: "Plans", id }],
    }),

    createPlan: builder.mutation<Plan, Partial<Plan>>({
      query: (data) => ({
        url: "dashboard/plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Plans"],
    }),

    updatePlan: builder.mutation<Plan, { id: string; data: Partial<Plan> }>({
      query: ({ id, data }) => ({
        url: `dashboard/plans/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Plans", id },
        "Plans",
      ],
    }),

    deletePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `dashboard/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),

    // Clients
    getClients: builder.query<
      ClientPlan[],
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        if (params?.page && params?.limit) {
          return `dashboard/clients?page=${params.page}&limit=${params.limit}`;
        }
        return "dashboard/clients";
      },
      providesTags: ["Clients"],
    }),

    getClientById: builder.query<ClientPlan, string>({
      query: (id) => `dashboard/clients/${id}`,
      providesTags: (result, error, id) => [{ type: "Clients", id }],
    }),

    // Agents
    getAgents: builder.query<Agent[], { page?: number; limit?: number } | void>(
      {
        query: (params) => {
          if (params?.page && params?.limit) {
            return `dashboard/agents?page=${params.page}&limit=${params.limit}`;
          }
          return "dashboard/agents";
        },
        providesTags: ["Agents"],
      },
    ),

    getAgentById: builder.query<Agent, string>({
      query: (id) => `dashboard/agents/${id}`,
      providesTags: (result, error, id) => [{ type: "Agents", id }],
    }),

    // Users
    getUsers: builder.query<User[], { page?: number; limit?: number } | void>({
      query: (params) => {
        if (params?.page && params?.limit) {
          return `dashboard/users?page=${params.page}&limit=${params.limit}`;
        }
        return "dashboard/users";
      },
      providesTags: ["Users"],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `dashboard/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    createUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "dashboard/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `dashboard/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        "Users",
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `dashboard/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // Waiting List
    getWaitingList: builder.query<
      WaitingList[],
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        if (params?.page && params?.limit) {
          return `dashboard/waiting-list?page=${params.page}&limit=${params.limit}`;
        }
        return "dashboard/waiting-list";
      },
      providesTags: ["WaitingList"],
    }),
  }),
});

export const {
  // Plans
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  // Clients
  useGetClientsQuery,
  useGetClientByIdQuery,
  // Agents
  useGetAgentsQuery,
  useGetAgentByIdQuery,
  // Users
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  // Waiting List
  useGetWaitingListQuery,
} = dashboardApi;
