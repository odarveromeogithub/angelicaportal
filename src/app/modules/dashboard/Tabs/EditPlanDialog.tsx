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
import { ANGELICA_FORM_STEPS } from "../../../core/constants/angelica-form-steps";
import { angelicaLifePlanSchema } from "../../../core/schemas/angelica-life-plan.schema";
import type { IAngelicaLifePlanFormData } from "../../../core/interfaces/angelica-life-plan.interface";
import Step1Plan from "../../../modules/shared/angelica-life-plan/steps/Step1Plan";
import Step2Planholder from "../../../modules/shared/angelica-life-plan/steps/Step2Planholder";
import Step3Beneficiary from "../../../modules/shared/angelica-life-plan/steps/Step3Beneficiary";
import Step4Submit from "../../../modules/shared/angelica-life-plan/steps/Step4Submit";
import { useToast } from "../../../core/hooks/useToast";

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
                          />
                        )}
                        {step.number === 3 && (
                          <Step3Beneficiary
                            control={control}
                            errors={errors}
                            onBack={() => {}} // No navigation in edit mode
                            onNext={() => {}} // No navigation in edit mode
                            showNavigation={false}
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
