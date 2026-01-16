import { useState } from "react";
import type { PlanholderFormData } from "@/app/core/interfaces/angelica-life-plan.interface";
import { Button } from "@/app/core/components/ui/button";
import { FormField } from "@/app/core/components/form/FormField";
import { FormSelect } from "@/app/core/components/form/FormSelect";
import { Label } from "@/app/core/components/ui/label";
import { Calendar } from "@/app/core/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/core/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import {
  GENDER_OPTIONS,
  CIVIL_STATUS_OPTIONS,
  PHONE_CONFIG,
  GRID_LAYOUTS,
  FIELD_CLASSES,
} from "@/app/core/constants/angelica-life-plan";
import { cn } from "@/app/core/lib/utils";

interface Step2PlanholderProps {
  data: PlanholderFormData;
  onChange: (data: PlanholderFormData) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2Planholder({
  data,
  onChange,
  onBack,
  onNext,
}: Step2PlanholderProps) {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange({
        ...data,
        dateOfBirth: formattedDate,
      });
    }
    setOpenDatePicker(false);
  };

  const isComplete =
    data.firstName &&
    data.lastName &&
    data.dateOfBirth &&
    data.gender &&
    data.civilStatus &&
    data.email &&
    data.contactNumber &&
    data.street &&
    data.barangay &&
    data.cityMunicipal &&
    data.province &&
    data.zipCode;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Planholder Details</h2>

        <div className={cn(GRID_LAYOUTS.threeColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="First Name"
            id="firstName"
            name="firstName"
            value={data.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            required
            autoFocus
          />

          <FormField
            label="Middle Name"
            id="middleName"
            name="middleName"
            value={data.middleName}
            onChange={handleInputChange}
            placeholder="Middle Name"
          />

          <FormField
            label="Last Name"
            id="lastName"
            name="lastName"
            value={data.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
          />
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Name Extension"
            id="nameExtension"
            name="nameExtension"
            value={data.nameExtension}
            onChange={handleInputChange}
            placeholder="ex. Jr, Sr, III..."
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="dateOfBirth" className="text-xs sm:text-sm font-semibold">
              Date of Birth
            </Label>
            <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="dateOfBirth"
                  className="h-9 sm:h-10 w-full justify-between rounded-lg border-gray-200 font-normal text-xs sm:text-sm"
                >
                  {data.dateOfBirth ? format(new Date(data.dateOfBirth), "MMM dd, yyyy") : "Select date"}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.dateOfBirth ? new Date(data.dateOfBirth) : undefined}
                  captionLayout="dropdown"
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormSelect
            label="Gender"
            id="gender"
            value={data.gender}
            onValueChange={(value) => onChange({ ...data, gender: value })}
            options={GENDER_OPTIONS}
            placeholder="Select Gender"
            required
          />

          <FormSelect
            label="Civil Status"
            id="civilStatus"
            value={data.civilStatus}
            onValueChange={(value) => onChange({ ...data, civilStatus: value })}
            options={CIVIL_STATUS_OPTIONS}
            placeholder="Select Civil Status"
            required
          />
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            required
          />

          <div className={FIELD_CLASSES.wrapper}>
            <Label htmlFor="contactNumber" className={cn(FIELD_CLASSES.label)}>
              Contact Number
              <span className="text-red-600 ml-1">*</span>
            </Label>
            <div className="flex items-center h-9 sm:h-10 rounded-lg border border-gray-200 bg-white px-3">
              <span className="text-xs sm:text-sm font-semibold text-gray-600 mr-2">
                {PHONE_CONFIG.countryCode}
              </span>
              <input
                id="contactNumber"
                name="contactNumber"
                type="text"
                value={data.contactNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, PHONE_CONFIG.maxLength);
                  onChange({ ...data, contactNumber: value });
                }}
                placeholder={PHONE_CONFIG.placeholder}
                maxLength={PHONE_CONFIG.maxLength}
                className="flex-1 outline-none text-sm"
                aria-label="Phone number without country code"
              />
            </div>
          </div>
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Lot/House Number"
            id="lotHouseNumber"
            name="lotHouseNumber"
            value={data.lotHouseNumber}
            onChange={handleInputChange}
            placeholder="Lot House Number"
          />

          <FormField
            label="Street"
            id="street"
            name="street"
            value={data.street}
            onChange={handleInputChange}
            placeholder="Street"
            required
          />
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Barangay"
            id="barangay"
            name="barangay"
            value={data.barangay}
            onChange={handleInputChange}
            placeholder="Barangay"
            required
          />

          <FormField
            label="City/Municipal"
            id="cityMunicipal"
            name="cityMunicipal"
            value={data.cityMunicipal}
            onChange={handleInputChange}
            placeholder="City/Municipal"
            required
          />
        </div>

        <div className={GRID_LAYOUTS.twoColumns}>
          <FormField
            label="Province"
            id="province"
            name="province"
            value={data.province}
            onChange={handleInputChange}
            placeholder="Province"
            required
          />

          <FormField
            label="Zip Code"
            id="zipCode"
            name="zipCode"
            value={data.zipCode}
            onChange={handleInputChange}
            placeholder="Zip Code"
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className={cn(FIELD_CLASSES.button.base, FIELD_CLASSES.button.secondary, "flex-1 sm:flex-none")}
          aria-label="Go back to previous step"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isComplete}
          className={cn(FIELD_CLASSES.button.base, FIELD_CLASSES.button.primary, "flex-1 sm:flex-none")}
          aria-label="Proceed to next step"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
