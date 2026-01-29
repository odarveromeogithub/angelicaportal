import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
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

// Enhanced field classes for edit dialog - larger and more prominent
const EDIT_DIALOG_FIELD_CLASSES = {
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

// Enhanced grid layouts for edit dialog - better spacing in modal context
const EDIT_DIALOG_GRID_LAYOUTS = {
  threeColumns:
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6",
  fourColumns:
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6",
  twoColumns: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6",
  spacing: "mb-6 md:mb-7 lg:mb-8",
  section: "px-4 md:px-6 lg:px-8 py-5 md:py-6 lg:py-8",
};

interface EditPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planData?: any; // The plan data to edit
}

export function EditPlanDialog({
  open,
  onOpenChange,
  planData,
}: EditPlanDialogProps) {
  const toast = useToast();
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]));
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IAngelicaLifePlanFormData>({
    resolver: yupResolver(angelicaLifePlanSchema) as any,
    mode: "onChange",
    defaultValues: {
      plan: {
        salesCounselorName: planData?.plan?.salesCounselorName || "",
        salesCounselorCode: planData?.plan?.salesCounselorCode || "",
        salesCounselorReferral: planData?.plan?.salesCounselorReferral || "",
        contactPrice: planData?.plan?.contactPrice || "",
        planType: planData?.plan?.planType || "",
        modeOfPayment: planData?.plan?.modeOfPayment || "",
        termOfPay: planData?.plan?.termOfPay || "",
        installment: planData?.plan?.installment || "",
        docStamp: planData?.plan?.docStamp || "",
      },
      planholder: {
        firstName: planData?.planholder?.firstName || "",
        middleName: planData?.planholder?.middleName || "",
        lastName: planData?.planholder?.lastName || "",
        nameExtension: planData?.planholder?.nameExtension || "",
        dateOfBirth: planData?.planholder?.dateOfBirth || "",
        gender: planData?.planholder?.gender || "",
        civilStatus: planData?.planholder?.civilStatus || "",
        email: planData?.planholder?.email || "",
        contactNumber: planData?.planholder?.contactNumber || "",
        lotHouseNumber: planData?.planholder?.lotHouseNumber || "",
        street: planData?.planholder?.street || "",
        barangay: planData?.planholder?.barangay || "",
        cityMunicipal: planData?.planholder?.cityMunicipal || "",
        province: planData?.planholder?.province || "",
        zipCode: planData?.planholder?.zipCode || "",
      },
      beneficiaries: planData?.beneficiaries || [
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
      planholder_signature: planData?.planholder_signature || "",
      id_upload: planData?.id_upload || null,
      agree_to_consent: planData?.agree_to_consent || false,
    },
  });

  const toggleStepExpansion = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber);
    } else {
      newExpanded.add(stepNumber);
    }
    setExpandedSteps(newExpanded);
  };

  const onSubmit = async (data: IAngelicaLifePlanFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement the update API call
      console.log("Updating plan:", data);
      toast.success("Plan updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update plan", "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setExpandedSteps(new Set([1]));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto p-0"
        showCloseButton={false}
      >
        {/* Screen reader only DialogHeader for accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>Edit Plan</DialogTitle>
          <DialogDescription>
            Modify plan details across all sections including plan information,
            planholder details, beneficiary information, and submission
            requirements.
          </DialogDescription>
        </DialogHeader>

        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-5 sm:px-7 sm:py-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.12em] text-white/70">
              Edit Form
            </p>
            <div>
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Edit className="w-6 h-6" />
                Edit Plan
              </h2>
              <p className="text-white/80 mt-1">
                Modify plan details across all sections
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-7 space-y-6">
          <div className="space-y-4">
            {ANGELICA_FORM_STEPS.map((step) => (
              <motion.div
                key={step.number}
                className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step.number * 0.1 }}
              >
                {/* Step Header */}
                <button
                  onClick={() => toggleStepExpansion(step.number)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${
                        expandedSteps.has(step.number)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600 dark:bg-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {step.label}
                    </span>
                  </div>
                  {expandedSteps.has(step.number) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {/* Step Content */}
                <AnimatePresence>
                  {expandedSteps.has(step.number) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-white dark:bg-slate-900">
                        {step.number === 1 && (
                          <Step1Plan
                            control={control}
                            errors={errors}
                            onNext={() => {}} // No navigation in edit mode
                            showNavigation={false}
                            customFieldClasses={EDIT_DIALOG_FIELD_CLASSES}
                            customGridLayouts={EDIT_DIALOG_GRID_LAYOUTS}
                          />
                        )}
                        {step.number === 2 && (
                          <Step2Planholder
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            onBack={() => {}} // No navigation in edit mode
                            onNext={() => {}} // No navigation in edit mode
                            showNavigation={false}
                            customFieldClasses={EDIT_DIALOG_FIELD_CLASSES}
                            customGridLayouts={EDIT_DIALOG_GRID_LAYOUTS}
                          />
                        )}
                        {step.number === 3 && (
                          <Step3Beneficiary
                            control={control}
                            errors={errors}
                            onBack={() => {}} // No navigation in edit mode
                            onNext={() => {}} // No navigation in edit mode
                            showNavigation={false}
                            customFieldClasses={EDIT_DIALOG_FIELD_CLASSES}
                            customGridLayouts={EDIT_DIALOG_GRID_LAYOUTS}
                          />
                        )}
                        {step.number === 4 && (
                          <Step4Submit
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            onBack={() => {}} // No navigation in edit mode
                            onSubmit={handleSubmit(onSubmit)}
                            isLoading={isLoading}
                            showNavigation={false}
                            customFieldClasses={EDIT_DIALOG_FIELD_CLASSES}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              className="shadow-sm"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="gap-2 shadow-md"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Plan"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
