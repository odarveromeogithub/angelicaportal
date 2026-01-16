import type { PlanFormData } from "@/app/core/interfaces/angelica-life-plan.interface";
import { Button } from "@/app/core/components/ui/button";
import { Input } from "@/app/core/components/ui/input";
import { Label } from "@/app/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="salesCounselorName" className="text-xs sm:text-sm font-semibold">
              Sales Counselor Name
            </Label>
            <Input
              id="salesCounselorName"
              name="salesCounselorName"
              type="text"
              value={data.salesCounselorName}
              onChange={handleInputChange}
              placeholder="CLIENT PORTAL (MINDANAO 2)"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="salesCounselorCode" className="text-xs sm:text-sm font-semibold">
              Sales Counselor Code
            </Label>
            <Input
              id="salesCounselorCode"
              name="salesCounselorCode"
              type="text"
              value={data.salesCounselorCode}
              onChange={handleInputChange}
              placeholder="M-005-46-000-04248"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="salesCounselorReferral" className="text-xs sm:text-sm font-semibold">
              Sales Counselor Referral
            </Label>
            <Input
              id="salesCounselorReferral"
              name="salesCounselorReferral"
              type="text"
              value={data.salesCounselorReferral}
              onChange={handleInputChange}
              placeholder="https://sc.cclpi.com.ph:8080/#/referral/4f030d0434..."
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contactPrice" className="text-xs sm:text-sm font-semibold">
              Contact Price
            </Label>
            <Input
              id="contactPrice"
              name="contactPrice"
              type="number"
              value={data.contactPrice}
              onChange={handleInputChange}
              placeholder="30000"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="planType" className="text-xs sm:text-sm font-semibold">
              Plan Type
            </Label>
            <Select value={data.planType} onValueChange={(value) => onChange({ ...data, planType: value })}>
              <SelectTrigger className="w-full h-9 sm:h-10 rounded-lg border-gray-200 text-sm">
                <SelectValue placeholder="Select Plan Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Angelica Life Plan 5">Angelica Life Plan 5</SelectItem>
                <SelectItem value="Angelica Life Plan 10">Angelica Life Plan 10</SelectItem>
                <SelectItem value="Angelica Life Plan 15">Angelica Life Plan 15</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="modeOfPayment" className="text-xs sm:text-sm font-semibold">
              Mode of Payment
            </Label>
            <Select value={data.modeOfPayment} onValueChange={(value) => onChange({ ...data, modeOfPayment: value })}>
              <SelectTrigger className="w-full h-9 sm:h-10 rounded-lg border-gray-200 text-sm">
                <SelectValue placeholder="Select Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="termOfPay" className="text-xs sm:text-sm font-semibold">
              Term of Pay
            </Label>
            <Select value={data.termOfPay} onValueChange={(value) => onChange({ ...data, termOfPay: value })}>
              <SelectTrigger className="w-full h-9 sm:h-10 rounded-lg border-gray-200 text-sm">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Installment">Installment</SelectItem>
                <SelectItem value="Single Premium">Single Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="installment" className="text-xs sm:text-sm font-semibold">
              Installment
            </Label>
            <Input
              id="installment"
              name="installment"
              type="number"
              value={data.installment}
              onChange={handleInputChange}
              placeholder="540.00"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="docStamp" className="text-xs sm:text-sm font-semibold">
              Doc Stamp
            </Label>
            <Input
              id="docStamp"
              name="docStamp"
              type="number"
              value={data.docStamp}
              onChange={handleInputChange}
              placeholder="60.00"
              className="h-9 sm:h-10 rounded-lg border-gray-200 text-sm"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!isComplete}
        className="w-full h-10 sm:h-11 px-6 sm:px-8 rounded-lg !bg-blue-600 text-xs sm:text-sm font-semibold uppercase tracking-wide !text-white hover:!bg-blue-700 disabled:!bg-gray-300 disabled:cursor-not-allowed"
      >
        Next
      </Button>
    </div>
  );
}
