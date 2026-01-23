import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/app/core/components/ui/card";
import Step1Plan from "./steps/Step1Plan.tsx";
import Step2Planholder from "./steps/Step2Planholder.tsx";
import Step3Beneficiary from "./steps/Step3Beneficiary.tsx";
import Step4Submit from "./steps/Step4Submit.tsx";
import { ANGELICA_FORM_STEPS } from "@/app/core/constants/angelica-form-steps";
import { angelicaLifePlanApi } from "@/app/core/state/api";
import type {
  IAngelicaLifePlanFormData,
  IBeneficiaryFormData,
  IPlanFormData,
  IPlanholderFormData,
} from "@/app/core/interfaces/angelica-life-plan.interface";

export default function AngelicaLifePlan() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMutation] = angelicaLifePlanApi.useSubmitAngelicaLifePlanMutation();

  const [formData, setFormData] = useState<IAngelicaLifePlanFormData>({
    plan: {
      salesCounselorName: "",
      salesCounselorCode: "",
      salesCounselorReferral: "",
      contactPrice: "",
      planType: "",
      modeOfPayment: "",
      termOfPay: "",
      installment: "",
      docStamp: "",
    },
    planholder: {
      firstName: "",
      middleName: "",
      lastName: "",
      nameExtension: "",
      dateOfBirth: "",
      gender: "",
      civilStatus: "",
      email: "",
      contactNumber: "",
      lotHouseNumber: "",
      street: "",
      barangay: "",
      cityMunicipal: "",
      province: "",
      zipCode: "",
    },
    beneficiaries: [
      {
        firstName: "",
        middleName: "",
        lastName: "",
        nameExtension: "",
        age: "",
        gender: "",
        address: "",
        relationship: "",
      },
    ],
    planholder_signature: "",
    id_upload: null,
    agree_to_consent: false,
  });

  const handlePlanChange = (data: IPlanFormData) => {
    setFormData({ ...formData, plan: data });
  };

  const handlePlanholderChange = (data: IPlanholderFormData) => {
    setFormData({ ...formData, planholder: data });
  };

  const handleBeneficiariesChange = (data: IBeneficiaryFormData[]) => {
    setFormData({ ...formData, beneficiaries: data });
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (submitData: {
    planholder_signature: string;
    id_upload: File | null;
    agree_to_consent: boolean;
  }) => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      // Create FormData for multipart submission
      const formDataToSend = new FormData();

      // Add plan data
      formDataToSend.append("plan", JSON.stringify(formData.plan));

      // Add planholder data
      formDataToSend.append("planholder", JSON.stringify(formData.planholder));

      // Add beneficiaries data
      formDataToSend.append(
        "beneficiaries",
        JSON.stringify(formData.beneficiaries)
      );

      // Add signature and consent
      formDataToSend.append("planholder_signature", submitData.planholder_signature);
      formDataToSend.append("agree_to_consent", String(submitData.agree_to_consent));

      // Add file if exists
      if (submitData.id_upload) {
        formDataToSend.append("id_upload", submitData.id_upload);
      }

      // Submit via RTK Query mutation
      await submitMutation(formDataToSend).unwrap();

      toast.success("Form submitted successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error submitting form:", error);
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Use form steps from constants instead of hardcoded array
  const steps = ANGELICA_FORM_STEPS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 sm:px-3 md:px-4 lg:px-6 py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="flex h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-blue-500 bg-white shadow-md hover:shadow-lg transition-shadow">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-600">C</span>
            </div>
            <div className="leading-tight text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wide text-blue-600 break-words">
                CCLPI Plans
              </h1>
              <p className="text-sm sm:text-base md:text-lg italic text-blue-500 mt-0.5">Angelica Life Plan</p>
            </div>
          </div>
        </div>

        {/* Step Indicator - Responsive */}
        <div className="flex flex-wrap justify-center items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 gap-1 sm:gap-2 md:gap-3">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <div
                className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all flex-shrink-0 ${
                  currentStep >= step.number
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {step.number}
              </div>
              <p
                className={`hidden sm:block text-xs sm:text-sm md:text-base font-semibold transition-all ${
                  currentStep >= step.number
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 md:w-16 lg:w-20 h-1 mx-0.5 sm:mx-1 md:mx-2 rounded transition-all ${
                    currentStep > step.number
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content - Responsive Card */}
        <Card className="rounded-lg sm:rounded-xl md:rounded-2xl border border-blue-100 bg-white/95 shadow-lg md:shadow-xl p-3 sm:p-5 md:p-6 lg:p-8">
          <CardContent className="p-0">
            {currentStep === 1 && (
              <Step1Plan
                data={formData.plan}
                onChange={handlePlanChange}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <Step2Planholder
                data={formData.planholder}
                onChange={handlePlanholderChange}
                onBack={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 3 && (
              <Step3Beneficiary
                data={formData.beneficiaries}
                onChange={handleBeneficiariesChange}
                onBack={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 4 && (
              <Step4Submit
                onBack={handlePrevStep}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
