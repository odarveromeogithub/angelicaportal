import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../core/components/ui/dialog";
import { Button } from "../../../core/components/ui/button";
import { ANGELICA_FORM_STEPS } from "../../../core/constants/angelicaFormSteps";
import { angelicaLifePlanSchema } from "../../../core/schemas/angelicaLifePlan.schema";
import type { IAngelicaLifePlanFormData } from "../../../core/interfaces/angelicaLifePlan.interface";
import Step1Plan from "../../shared/angelica-life-plan/steps/Step1Plan";
import Step2Planholder from "../../shared/angelica-life-plan/steps/Step2Planholder";
import Step3Beneficiary from "../../shared/angelica-life-plan/steps/Step3Beneficiary";
import Step4Submit from "../../shared/angelica-life-plan/steps/Step4Submit";
import { useToast } from "../../../core/hooks/useToast";
import { selectAuthUser } from "../../../core/state/selector/auth.selector";
import { getSignaturePhoto } from "../../../core/helpers/authStorage";

// Enhanced field classes for add dialog - larger and more prominent
const ADD_DIALOG_FIELD_CLASSES = {
  wrapper: "flex flex-col gap-3 w-full",
  label: "text-sm font-semibold text-gray-700 dark:text-gray-300",
  input:
    "h-12 rounded-lg border-gray-200 dark:border-slate-700 dark:bg-slate-900/70 text-base w-full",
  select:
    "w-full h-12 rounded-lg border-gray-200 dark:border-slate-700 dark:bg-slate-900/70 text-base",
  button: {
    base: "rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-200",
    primary:
      "h-12 px-8 !bg-blue-600 !text-white hover:!bg-blue-700 active:!bg-blue-800 disabled:!bg-gray-300 disabled:cursor-not-allowed",
    secondary:
      "h-12 px-8 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 active:bg-gray-100",
    success:
      "h-12 px-8 !bg-green-600 !text-white hover:!bg-green-700 active:!bg-green-800 disabled:!bg-gray-300 disabled:cursor-not-allowed",
    danger:
      "h-12 px-6 !bg-red-600 !text-white hover:!bg-red-700 active:!bg-red-800",
    light:
      "h-12 px-8 !bg-blue-100 !text-blue-600 hover:!bg-blue-200 active:!bg-blue-300 dark:!bg-blue-900/40 dark:!text-blue-300",
  },
};

// Enhanced grid layouts for add dialog - better spacing in modal context
const ADD_DIALOG_GRID_LAYOUTS = {
  threeColumns: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  fourColumns: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  twoColumns: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  spacing: "mb-6 md:mb-7 lg:mb-8",
  section: "px-4 md:px-6 lg:px-8 py-5 md:py-6 lg:py-8",
};

interface AddPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPlanDialog({ open, onOpenChange }: AddPlanDialogProps) {
  const toast = useToast();
  const user = useSelector(selectAuthUser);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    trigger,
  } = useForm<IAngelicaLifePlanFormData>({
    resolver: yupResolver(angelicaLifePlanSchema) as any,
    mode: "onChange",
    defaultValues: {
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
        firstName: user?.first_name || "",
        middleName: user?.middle_name || "",
        lastName: user?.last_name || "",
        nameExtension: user?.name_extension || "",
        dateOfBirth: user?.birthdate || "",
        gender: user?.gender || "",
        civilStatus: "",
        email: user?.email || "",
        contactNumber: user?.contact_number || "",
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
      planholder_signature: getSignaturePhoto() || "",
      id_upload: null,
      agree_to_consent: false,
    },
  });

  const handleNextStep = async () => {
    // Validate current step before proceeding
    let isStepValid = false;
    switch (currentStep) {
      case 1:
        isStepValid = await trigger("plan");
        break;
      case 2:
        isStepValid = await trigger("planholder");
        break;
      case 3:
        isStepValid = await trigger("beneficiaries");
        break;
      default:
        isStepValid = true;
    }

    if (isStepValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (!isStepValid) {
      toast.error(
        "Please fill in all required fields",
        "Complete the current step before proceeding.",
      );
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: IAngelicaLifePlanFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement the create API call
      console.log("Creating new plan:", data);
      toast.success("Plan created successfully!");
      onOpenChange(false);
      reset();
      setCurrentStep(1);
    } catch (error) {
      console.error("Failed to create plan:", error);
      toast.error("Failed to create plan", "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setCurrentStep(1);
    onOpenChange(false);
  };

  const currentStepData = ANGELICA_FORM_STEPS.find(
    (step) => step.number === currentStep,
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-[95vw] w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0"
        showCloseButton={false}
      >
        {/* Screen reader only DialogHeader for accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>Add New Plan</DialogTitle>
          <DialogDescription>
            Create a new plan by filling out the information step by step.
          </DialogDescription>
        </DialogHeader>

        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.12em] text-white/70">
              Add New Plan
            </p>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="truncate">Create Plan</span>
              </h2>
              <p className="text-white/80 mt-1 text-sm sm:text-base">
                Step {currentStep} of 4: {currentStepData?.label}
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-2 sm:gap-4">
            {ANGELICA_FORM_STEPS.map((step, index) => (
              <div
                key={step.number}
                className="flex items-center gap-2 justify-center sm:justify-start"
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${
                    currentStep >= step.number
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600 dark:bg-slate-600 dark:text-slate-300"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium text-center sm:text-left ${
                    currentStep >= step.number
                      ? "text-green-600 dark:text-green-300"
                      : "text-gray-500 dark:text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
                {index < ANGELICA_FORM_STEPS.length - 1 && (
                  <div className="hidden sm:block">
                    <div
                      className={`w-8 h-1 rounded ${
                        currentStep > step.number
                          ? "bg-green-500"
                          : "bg-gray-200 dark:bg-slate-600"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <Step1Plan
                  control={control}
                  errors={errors}
                  onNext={handleNextStep}
                  showNavigation={false}
                  customFieldClasses={ADD_DIALOG_FIELD_CLASSES}
                  customGridLayouts={ADD_DIALOG_GRID_LAYOUTS}
                />
              )}
              {currentStep === 2 && (
                <Step2Planholder
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  showNavigation={false}
                  customFieldClasses={ADD_DIALOG_FIELD_CLASSES}
                  customGridLayouts={ADD_DIALOG_GRID_LAYOUTS}
                />
              )}
              {currentStep === 3 && (
                <Step3Beneficiary
                  control={control}
                  errors={errors}
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  showNavigation={false}
                  customFieldClasses={ADD_DIALOG_FIELD_CLASSES}
                  customGridLayouts={ADD_DIALOG_GRID_LAYOUTS}
                />
              )}
              {currentStep === 4 && (
                <Step4Submit
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  onBack={handlePrevStep}
                  onSubmit={handleSubmit(onSubmit)}
                  isLoading={isLoading}
                  showNavigation={false}
                  customFieldClasses={ADD_DIALOG_FIELD_CLASSES}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>

          <div className="flex gap-3 order-1 sm:order-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="flex-1 sm:flex-none gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="flex-1 sm:flex-none gap-2"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                className="flex-1 sm:flex-none gap-2"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Create Plan</span>
                    <span className="sm:hidden">Create</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
