import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import type { IAngelicaLifePlanFormData } from "@/app/core/interfaces/angelica-life-plan.interface";
import { Button } from "@/app/core/components/ui/button";
import { FormField, FormSelect, PhoneInput } from "@/app/core/components/form";
import { Label } from "@/app/core/components/ui/label";
import { Calendar } from "@/app/core/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/core/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useModal } from "@/app/core/hooks";
import {
  GENDER_OPTIONS,
  CIVIL_STATUS_OPTIONS,
  GRID_LAYOUTS,
  FIELD_CLASSES,
} from "@/app/core/constants/angelica-life-plan";
import { cn } from "@/app/core/lib/utils";

interface Step2PlanholderProps {
  control: Control<IAngelicaLifePlanFormData>;
  errors: FieldErrors<IAngelicaLifePlanFormData>;
  setValue: UseFormSetValue<IAngelicaLifePlanFormData>;
  onBack: () => void;
  onNext: () => void;
  showNavigation?: boolean;
}

export default function Step2Planholder({
  control,
  errors,
  setValue,
  onBack,
  onNext,
  showNavigation = true,
}: Step2PlanholderProps) {
  const datePickerModal = useModal();

  // Watch the planholder form values
  const planholderValues = useWatch({
    control,
    name: "planholder",
  });

  // Check if all required planholder fields are filled and valid
  const planholderErrors = errors.planholder || {};
  const hasPlanholderErrors = Object.keys(planholderErrors).length > 0;
  const isComplete =
    planholderValues?.firstName &&
    planholderValues?.lastName &&
    planholderValues?.dateOfBirth &&
    planholderValues?.gender &&
    planholderValues?.civilStatus &&
    planholderValues?.email &&
    planholderValues?.contactNumber &&
    planholderValues?.contactNumberCountryCode &&
    planholderValues?.street &&
    planholderValues?.barangay &&
    planholderValues?.cityMunicipal &&
    planholderValues?.province &&
    planholderValues?.zipCode &&
    !hasPlanholderErrors;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
          Planholder Details
        </h2>

        <div className={cn(GRID_LAYOUTS.threeColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="First Name"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            required
            autoFocus
            registerProps={control.register("planholder.firstName")}
            error={errors.planholder?.firstName?.message}
          />

          <FormField
            label="Middle Name"
            id="middleName"
            name="middleName"
            placeholder="Middle Name"
            registerProps={control.register("planholder.middleName")}
            error={errors.planholder?.middleName?.message}
          />

          <FormField
            label="Last Name"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            required
            registerProps={control.register("planholder.lastName")}
            error={errors.planholder?.lastName?.message}
          />
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Name Extension"
            id="nameExtension"
            name="nameExtension"
            placeholder="ex. Jr, Sr, III..."
            registerProps={control.register("planholder.nameExtension")}
            error={errors.planholder?.nameExtension?.message}
          />

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="dateOfBirth"
              className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400"
            >
              Date of Birth
            </Label>
            <Controller
              name="planholder.dateOfBirth"
              control={control}
              render={({ field }) => (
                <Popover
                  open={datePickerModal.isOpen}
                  onOpenChange={datePickerModal.setIsOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="dateOfBirth"
                      className="h-9 sm:h-10 w-full justify-between rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-normal text-xs sm:text-sm"
                    >
                      {field.value
                        ? format(new Date(field.value), "MMM dd, yyyy")
                        : "Select date"}
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, "yyyy-MM-dd");
                          field.onChange(formattedDate);
                        }
                        datePickerModal.close();
                      }}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.planholder?.dateOfBirth && (
              <p className="text-xs text-red-600 mt-1">
                {errors.planholder.dateOfBirth.message}
              </p>
            )}
          </div>
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormSelect
            label="Gender"
            id="gender"
            control={control}
            name="planholder.gender"
            options={GENDER_OPTIONS}
            placeholder="Select Gender"
            required
            error={errors.planholder?.gender?.message}
          />

          <FormSelect
            label="Civil Status"
            id="civilStatus"
            control={control}
            name="planholder.civilStatus"
            options={CIVIL_STATUS_OPTIONS}
            placeholder="Select Civil Status"
            required
            error={errors.planholder?.civilStatus?.message}
          />
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            required
            registerProps={control.register("planholder.email")}
            error={errors.planholder?.email?.message}
          />

          <PhoneInput
            label="Contact Number"
            id="contactNumber"
            name="planholder.contactNumber"
            control={control}
            required
            countryCode={
              control._formValues.planholder?.contactNumberCountryCode || "+63"
            }
            onCountryCodeChange={(value) => {
              setValue("planholder.contactNumberCountryCode", value);
            }}
            error={errors.planholder?.contactNumber?.message}
          />
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Lot/House Number"
            id="lotHouseNumber"
            name="lotHouseNumber"
            placeholder="Lot House Number"
            registerProps={control.register("planholder.lotHouseNumber")}
            error={errors.planholder?.lotHouseNumber?.message}
          />

          <FormField
            label="Street"
            id="street"
            name="street"
            placeholder="Street"
            required
            registerProps={control.register("planholder.street")}
            error={errors.planholder?.street?.message}
          />
        </div>

        <div className={cn(GRID_LAYOUTS.twoColumns, GRID_LAYOUTS.spacing)}>
          <FormField
            label="Barangay"
            id="barangay"
            name="barangay"
            placeholder="Barangay"
            required
            registerProps={control.register("planholder.barangay")}
            error={errors.planholder?.barangay?.message}
          />

          <FormField
            label="City/Municipal"
            id="cityMunicipal"
            name="cityMunicipal"
            placeholder="City/Municipal"
            required
            registerProps={control.register("planholder.cityMunicipal")}
            error={errors.planholder?.cityMunicipal?.message}
          />
        </div>

        <div className={GRID_LAYOUTS.twoColumns}>
          <FormField
            label="Province"
            id="province"
            name="province"
            placeholder="Province"
            required
            registerProps={control.register("planholder.province")}
            error={errors.planholder?.province?.message}
          />

          <FormField
            label="Zip Code"
            id="zipCode"
            name="zipCode"
            placeholder="Zip Code"
            required
            registerProps={control.register("planholder.zipCode")}
            error={errors.planholder?.zipCode?.message}
          />
        </div>
      </div>

      {showNavigation && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className={cn(
              FIELD_CLASSES.button.base,
              FIELD_CLASSES.button.secondary,
              "flex-1 sm:flex-none",
            )}
            aria-label="Go back to previous step"
          >
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!isComplete}
            className={cn(
              FIELD_CLASSES.button.base,
              FIELD_CLASSES.button.primary,
              "flex-1 sm:flex-none",
            )}
            aria-label="Proceed to next step"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
