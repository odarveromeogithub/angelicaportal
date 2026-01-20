import httpClient from "../../clients/httpclients";
import {
  angelicaLifePlanSchema,
  planFormSchema,
  planholderFormSchema,
  beneficiaryFormSchema,
  submitFormSchema,
} from "../../schemas/angelica-life-plan.schema";
import type {
  AngelicaLifePlanSchema,
  PlanFormSchema,
  PlanholderFormSchema,
  BeneficiaryFormSchema,
  SubmitFormSchema,
} from "../../schemas/angelica-life-plan.schema";

// API response types
interface PlanResponse {
  success: boolean;
  message: string;
  data?: {
    planId: string;
    status: "draft" | "submitted" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
  };
}

interface PlanDetailsResponse {
  success: boolean;
  data: AngelicaLifePlanSchema;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: Record<string, string>;
}

class AngelicaLifePlanService {
  private baseEndpoint = "/angelica-life-plan";

  /**
   * Submit complete angelica life plan form
   * Validates all steps before submission
   */
  async submitPlan(data: AngelicaLifePlanSchema): Promise<PlanResponse> {
    try {
      // Validate complete form structure
      const validatedData = await angelicaLifePlanSchema.validate(data);

      const response = await httpClient.post<PlanResponse>(
        `${this.baseEndpoint}/submit`,
        validatedData
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit only plan form step
   */
  async submitPlanStep(data: PlanFormSchema): Promise<PlanResponse> {
    try {
      const validatedData = await planFormSchema.validate(data);

      const response = await httpClient.post<PlanResponse>(
        `${this.baseEndpoint}/plan`,
        validatedData
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit planholder (personal info) step
   */
  async submitPlanholderStep(data: PlanholderFormSchema): Promise<PlanResponse> {
    try {
      const validatedData = await planholderFormSchema.validate(data);

      const response = await httpClient.post<PlanResponse>(
        `${this.baseEndpoint}/planholder`,
        validatedData
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Add beneficiary
   */
  async addBeneficiary(data: BeneficiaryFormSchema): Promise<PlanResponse> {
    try {
      const validatedData = await beneficiaryFormSchema.validate(data);

      const response = await httpClient.post<PlanResponse>(
        `${this.baseEndpoint}/beneficiary`,
        validatedData
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit final step (signature, documents, consent)
   */
  async submitFinalStep(data: SubmitFormSchema): Promise<PlanResponse> {
    try {
      await submitFormSchema.validate(data);

      // FormData for file upload
      const formData = new FormData();
      
      if (data.planholder_signature) {
        formData.append("signature", data.planholder_signature);
      }
      
      if (data.id_upload && data.id_upload instanceof File) {
        formData.append("id_upload", data.id_upload);
      }
      
      formData.append("consent", String(data.agree_to_consent));

      const response = await httpClient.post<PlanResponse>(
        `${this.baseEndpoint}/submit-final`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch plan details by ID
   */
  async getPlan(planId: string): Promise<PlanDetailsResponse> {
    try {
      const response = await httpClient.get<PlanDetailsResponse>(
        `${this.baseEndpoint}/${planId}`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload signature image
   */
  async uploadSignature(
    file: File,
    planId?: string
  ): Promise<{
    success: boolean;
    signatureUrl: string;
  }> {
    try {
      const formData = new FormData();
      formData.append("signature", file);

      if (planId) {
        formData.append("planId", planId);
      }

      const response = await httpClient.post<{
        success: boolean;
        signatureUrl: string;
      }>(`${this.baseEndpoint}/signature/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload multiple documents
   */
  async uploadDocuments(
    files: File[],
    planId?: string
  ): Promise<{
    success: boolean;
    uploadedFiles: Array<{ name: string; url: string }>;
  }> {
    try {
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append(`documents[${index}]`, file);
      });

      if (planId) {
        formData.append("planId", planId);
      }

      const response = await httpClient.post<{
        success: boolean;
        uploadedFiles: Array<{ name: string; url: string }>;
      }>(`${this.baseEndpoint}/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch user's plan history
   */
  async getPlanHistory(): Promise<{
    success: boolean;
    plans: Array<{
      planId: string;
      planType: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    }>;
  }> {
    try {
      const response = await httpClient.get(`${this.baseEndpoint}/history`);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete/Cancel a plan
   */
  async deletePlan(planId: string): Promise<PlanResponse> {
    try {
      const response = await httpClient.delete<PlanResponse>(
        `${this.baseEndpoint}/${planId}`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handler for all service methods
   */
  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      // Axios error
      if ("response" in error && error.response) {
        const response = error.response as {
          data?: ErrorResponse;
          status: number;
        };
        const errorData = response.data as ErrorResponse;
        return new Error(
          errorData?.error || `API Error: ${response.status}`
        );
      }

      // Yup validation error
      if (error.name === "ValidationError") {
        return new Error(`Validation error: ${error.message}`);
      }

      return error;
    }

    return new Error("An unknown error occurred");
  }
}

export const angelicaLifePlanService = new AngelicaLifePlanService();
export default angelicaLifePlanService;
