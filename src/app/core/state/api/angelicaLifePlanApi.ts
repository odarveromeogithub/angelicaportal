import { baseApi } from "./baseApi";
import type {
  IAngelicaLifePlanFormData,
  AngelicaLifePlanResponse,
  AngelicaLifePlanListItem,
} from "../../interfaces/angelicaLifePlan.interface";

/**
 * Angelica Life Plan RTK Query API
 * Handles all angelica life plan related data fetching and mutations
 */

export const angelicaLifePlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all Angelica Life Plans
    getAngelicaLifePlans: builder.query<
      AngelicaLifePlanListItem[],
      { userId?: string } | undefined
    >({
      query: (params) => ({
        url: "angelica-life-plan",
        params,
      }),
      providesTags: ["AngelicaLifePlan"],
    }),

    // Get single Angelica Life Plan by ID
    getAngelicaLifePlanById: builder.query<IAngelicaLifePlanFormData, string>({
      query: (id) => `angelica-life-plan/${id}`,
      providesTags: (result, error, id) => [{ type: "AngelicaLifePlan", id }],
    }),

    // Submit complete Angelica Life Plan
    submitAngelicaLifePlan: builder.mutation<
      AngelicaLifePlanResponse,
      IAngelicaLifePlanFormData
    >({
      query: (data) => ({
        url: "angelica-life-plan/submit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AngelicaLifePlan"],
    }),

    // Save draft Angelica Life Plan
    saveDraftAngelicaLifePlan: builder.mutation<
      AngelicaLifePlanResponse,
      Partial<IAngelicaLifePlanFormData>
    >({
      query: (data) => ({
        url: "angelica-life-plan/draft",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AngelicaLifePlan"],
    }),

    // Update Angelica Life Plan
    updateAngelicaLifePlan: builder.mutation<
      AngelicaLifePlanResponse,
      { id: string; data: Partial<IAngelicaLifePlanFormData> }
    >({
      query: ({ id, data }) => ({
        url: `angelica-life-plan/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AngelicaLifePlan", id },
        "AngelicaLifePlan",
      ],
    }),

    // Delete Angelica Life Plan
    deleteAngelicaLifePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `angelica-life-plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AngelicaLifePlan"],
    }),

    // Upload ID document
    uploadIdDocument: builder.mutation<
      { success: boolean; url: string },
      FormData
    >({
      query: (formData) => ({
        url: "angelica-life-plan/upload-id",
        method: "POST",
        body: formData,
      }),
    }),

    // Upload signature
    uploadSignature: builder.mutation<
      { success: boolean; url: string },
      { planId: string; signature: string }
    >({
      query: (data) => ({
        url: "angelica-life-plan/upload-signature",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAngelicaLifePlansQuery,
  useGetAngelicaLifePlanByIdQuery,
  useSubmitAngelicaLifePlanMutation,
  useSaveDraftAngelicaLifePlanMutation,
  useUpdateAngelicaLifePlanMutation,
  useDeleteAngelicaLifePlanMutation,
  useUploadIdDocumentMutation,
  useUploadSignatureMutation,
} = angelicaLifePlanApi;
