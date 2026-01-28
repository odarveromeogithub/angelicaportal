import type { Control, FieldErrors } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { IAngelicaLifePlanFormData } from "@/app/core/interfaces/angelica-life-plan.interface";
import { Button } from "@/app/core/components/ui/button";
import { FormField, FormSelect } from "@/app/core/components/form";
import {
  PLAN_TYPES,
  PAYMENT_MODES,
  PAYMENT_TERMS,
  GRID_LAYOUTS,
  FIELD_CLASSES,
} from "@/app/core/constants/angelica-life-plan";
import { cn } from "@/app/core/lib/utils";

interface Step1PlanProps {
  control: Control<IAngelicaLifePlanFormData>;
  errors: FieldErrors<IAngelicaLifePlanFormData>;
  onNext: () => void;
  showNavigation?: boolean;
}

export default function Step1Plan({
  control,
  errors,
  onNext,
  showNavigation = true,
}: Step1PlanProps) {
  // Watch the plan form values
  const planValues = useWatch({
    control,
    name: "plan",
  });

  // Check if all required plan fields are filled and valid
  const planErrors = errors.plan || {};
  const hasPlanErrors = Object.values(planErrors).some(
    (error) =>
      error && typeof error === "object" && "message" in error && error.message,
  );
  const isComplete =
    planValues?.salesCounselorName?.trim() &&
    planValues?.salesCounselorCode?.trim() &&
    planValues?.salesCounselorReferral?.trim() &&
    planValues?.contactPrice?.trim() &&
    planValues?.planType &&
    planValues?.modeOfPayment &&
    planValues?.termOfPay &&
    planValues?.installment?.trim() &&
    planValues?.docStamp?.trim() &&
    !hasPlanErrors;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
          Plan Data
        </h2>

        <div className={cn(GRID_LAYOUTS.threeColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Sales Counselor Name"
            id="salesCounselorName"
            name="salesCounselorName"
            placeholder="CLIENT PORTAL (MINDANAO 2)"
            required
            autoFocus
            registerProps={control.register("plan.salesCounselorName")}
            error={errors.plan?.salesCounselorName?.message}
          />

          <FormField
            label="Sales Counselor Code"
            id="salesCounselorCode"
            name="salesCounselorCode"
            placeholder="M-005-46-000-04248"
            required
            registerProps={control.register("plan.salesCounselorCode")}
            error={errors.plan?.salesCounselorCode?.message}
          />

          <FormField
            label="Sales Counselor Referral"
            id="salesCounselorReferral"
            name="salesCounselorReferral"
            placeholder="https://sc.cclpi.com.ph:8080/#/referral/..."
            required
            registerProps={control.register("plan.salesCounselorReferral")}
            error={errors.plan?.salesCounselorReferral?.message}
          />
        </div>

        <div className={cn(GRID_LAYOUTS.fourColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Contact Price"
            id="contactPrice"
            name="contactPrice"
            type="number"
            placeholder="30000"
            required
            registerProps={control.register("plan.contactPrice")}
            error={errors.plan?.contactPrice?.message}
          />

          <FormSelect
            label="Plan Type"
            id="planType"
            control={control}
            name="plan.planType"
            options={PLAN_TYPES}
            placeholder="Select Plan Type"
            required
            error={errors.plan?.planType?.message}
          />

          <FormSelect
            label="Mode of Payment"
            id="modeOfPayment"
            control={control}
            name="plan.modeOfPayment"
            options={PAYMENT_MODES}
            placeholder="Select Payment Mode"
            required
            error={errors.plan?.modeOfPayment?.message}
          />

          <FormSelect
            label="Term of Pay"
            id="termOfPay"
            control={control}
            name="plan.termOfPay"
            options={PAYMENT_TERMS}
            placeholder="Select Term"
            required
            error={errors.plan?.termOfPay?.message}
          />
        </div>

        <div className={GRID_LAYOUTS.twoColumns}>
          <FormField
            label="Installment"
            id="installment"
            name="installment"
            type="number"
            placeholder="540.00"
            required
            registerProps={control.register("plan.installment")}
            error={errors.plan?.installment?.message}
          />

          <FormField
            label="Doc Stamp"
            id="docStamp"
            name="docStamp"
            type="number"
            placeholder="60.00"
            required
            registerProps={control.register("plan.docStamp")}
            error={errors.plan?.docStamp?.message}
          />
        </div>
      </div>

      {showNavigation && (
        <Button
          onClick={onNext}
          disabled={!isComplete}
          className={cn(
            "w-full",
            FIELD_CLASSES.button.base,
            FIELD_CLASSES.button.primary,
          )}
        >
          Next
        </Button>
      )}
    </div>
  );
}
