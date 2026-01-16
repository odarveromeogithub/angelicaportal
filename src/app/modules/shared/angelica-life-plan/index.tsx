import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/app/core/components/ui/card";
import Step1Plan from "./steps/Step1Plan.tsx";
import Step2Planholder from "./steps/Step2Planholder.tsx";
import Step3Beneficiary from "./steps/Step3Beneficiary.tsx";
import Step4Submit from "./steps/Step4Submit.tsx";
import type {
  AngelicaLifePlanFormData,
  BeneficiaryFormData,
  PlanFormData,
  PlanholderFormData,
} from "@/app/core/interfaces/angelica-life-plan.interface";

export default function AngelicaLifePlan() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<AngelicaLifePlanFormData>({
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

  const handlePlanChange = (data: PlanFormData) => {
    setFormData({ ...formData, plan: data });
  };

  const handlePlanholderChange = (data: PlanholderFormData) => {
    setFormData({ ...formData, planholder: data });
  };

  const handleBeneficiariesChange = (data: BeneficiaryFormData[]) => {
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

      // Submit to your backend
      const response = await fetch("/api/angelica-life-plan/submit", {
        method: "POST",
        body: formDataToSend,
        headers: {
          // Don't set Content-Type for FormData, browser will set it automatically
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success("Form submitted successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Plan" },
    { number: 2, label: "Planholder" },
    { number: 3, label: "Beneficiary" },
    { number: 4, label: "Submit" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 sm:px-4 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-blue-500 bg-white shadow-md">
              <span className="text-xl sm:text-2xl font-extrabold text-blue-600">C</span>
            </div>
            <div className="leading-tight text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wide text-blue-600">
                CCLPI Plans
              </h1>
              <p className="text-base sm:text-lg italic text-blue-500">Angelica Life Plan</p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex flex-wrap justify-center items-center mb-8 sm:mb-12 gap-2 sm:gap-3">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center gap-2 sm:gap-3">
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm transition-all flex-shrink-0 ${
                  currentStep >= step.number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {step.number}
              </div>
              <p
                className={`hidden sm:block ml-2 font-semibold text-xs sm:text-sm transition-all ${
                  currentStep >= step.number
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
              {index < steps.length - 1 && (
                <div
                  className={`w-10 sm:w-16 h-1 mx-1 sm:mx-2 rounded transition-all ${
                    currentStep > step.number
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card className="rounded-xl sm:rounded-2xl border-blue-100 bg-white/95 shadow-xl p-4 sm:p-8">
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
