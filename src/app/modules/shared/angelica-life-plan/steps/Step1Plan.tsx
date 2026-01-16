import type { PlanFormData } from "@/app/core/interfaces/angelica-life-plan.interface";
import { Button } from "@/app/core/components/ui/button";
import { FormField } from "@/app/core/components/form/FormField";
import { FormSelect } from "@/app/core/components/form/FormSelect";
import {
  PLAN_TYPES,
  PAYMENT_MODES,
  PAYMENT_TERMS,
  GRID_LAYOUTS,
  FIELD_CLASSES,
} from "@/app/core/constants/angelica-life-plan";
import { cn } from "@/app/core/lib/utils";

interface Step1PlanProps {
  data: PlanFormData;
  onChange: (data: PlanFormData) => void;
  onNext: () => void;
}

export default function Step1Plan({ data, onChange, onNext }: Step1PlanProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  const isComplete =
    data.salesCounselorName &&
    data.salesCounselorCode &&
    data.salesCounselorReferral &&
    data.contactPrice &&
    data.planType &&
    data.modeOfPayment &&
    data.termOfPay &&
    data.installment &&
    data.docStamp;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Plan Data</h2>

        <div className={cn(GRID_LAYOUTS.threeColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Sales Counselor Name"
            id="salesCounselorName"
            name="salesCounselorName"
            value={data.salesCounselorName}
            onChange={handleInputChange}
            placeholder="CLIENT PORTAL (MINDANAO 2)"
            required
            autoFocus
          />

          <FormField
            label="Sales Counselor Code"
            id="salesCounselorCode"
            name="salesCounselorCode"
            value={data.salesCounselorCode}
            onChange={handleInputChange}
            placeholder="M-005-46-000-04248"
            required
          />

          <FormField
            label="Sales Counselor Referral"
            id="salesCounselorReferral"
            name="salesCounselorReferral"
            value={data.salesCounselorReferral}
            onChange={handleInputChange}
            placeholder="https://sc.cclpi.com.ph:8080/#/referral/..."
            required
          />
        </div>

        <div className={cn(GRID_LAYOUTS.fourColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Contact Price"
            id="contactPrice"
            name="contactPrice"
            type="number"
            value={data.contactPrice}
            onChange={handleInputChange}
            placeholder="30000"
            required
          />

          <FormSelect
            label="Plan Type"
            id="planType"
            value={data.planType}
            onValueChange={(value) => onChange({ ...data, planType: value })}
            options={PLAN_TYPES}
            placeholder="Select Plan Type"
            required
          />

          <FormSelect
            label="Mode of Payment"
            id="modeOfPayment"
            value={data.modeOfPayment}
            onValueChange={(value) => onChange({ ...data, modeOfPayment: value })}
            options={PAYMENT_MODES}
            placeholder="Select Payment Mode"
            required
          />

          <FormSelect
            label="Term of Pay"
            id="termOfPay"
            value={data.termOfPay}
            onValueChange={(value) => onChange({ ...data, termOfPay: value })}
            options={PAYMENT_TERMS}
            placeholder="Select Term"
            required
          />
        </div>

        <div className={GRID_LAYOUTS.twoColumns}>
          <FormField
            label="Installment"
            id="installment"
            name="installment"
            type="number"
            value={data.installment}
            onChange={handleInputChange}
            placeholder="540.00"
            required
          />

          <FormField
            label="Doc Stamp"
            id="docStamp"
            name="docStamp"
            type="number"
            value={data.docStamp}
            onChange={handleInputChange}
            placeholder="60.00"
            required
          />
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!isComplete}
        className={cn("w-full", FIELD_CLASSES.button.base, FIELD_CLASSES.button.primary)}
      >
        Next
      </Button>
    </div>
  );
}
